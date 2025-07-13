#!/bin/bash
set -e

echo "Setting permissions for storage and cache..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

echo "Linking storage directory..."
php artisan storage:link

echo "Running database migrations..."
if ! php artisan migrate --force; then
  echo "⚠️ Migration failed. Continuing without stopping the container."
fi

echo "Clearing stale caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "Caching configuration for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
