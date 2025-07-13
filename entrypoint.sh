#!/bin/bash
set -e

echo "Setting permissions for storage and cache..."
mkdir -p /var/www/storage/logs
touch /var/www/storage/logs/laravel.log
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R ug+rwX /var/www/storage /var/www/bootstrap/cache

echo "Linking storage directory..."
php artisan storage:link

echo "Running database migrations..."
set +e  # Temporarily disable exit on error for migrate
php artisan migrate --force
MIGRATE_EXIT_CODE=$?
set -e  # Re-enable exit on error

if [ $MIGRATE_EXIT_CODE -ne 0 ]; then
  echo "⚠️ Migration failed or had errors (likely due to duplicate tables). Continuing deployment..."
fi

# Commented out cache clearing and caching to avoid permission errors
# echo "Clearing stale caches..."
# php artisan config:clear
# php artisan cache:clear
# php artisan route:clear
# php artisan view:clear

# echo "Caching configuration for production..."
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

echo "Setting permissions for Vite build output..."
chown -R www-data:www-data /var/www/public/build
chmod -R ug+rwX /var/www/public/build

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
