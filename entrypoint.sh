#!/bin/bash
set -e

echo "Creating required Laravel directories..."
mkdir -p \
  /var/www/storage/framework/{cache,sessions,views} \
  /var/www/storage/logs \
  /var/www/bootstrap/cache \
  /var/www/public/build

echo "Setting permissions..."
touch /var/www/storage/logs/laravel.log
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/build
chmod -R ug+rwX /var/www/storage /var/www/bootstrap/cache /var/www/public/build

echo "Running migrations..."
php artisan migrate --force || echo "⚠️ Migration failed (maybe already ran)"

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
