#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Setting permissions for storage and cache..."
# Set permissions for the web server user
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# --- ADDED: Run database migrations ---
echo "Running database migrations..."
php artisan migrate --force

# --- ADDED: Link the storage directory ---
echo "Linking storage directory..."
php artisan storage:link

echo "Clearing stale caches..."
# Clear any old cache files
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "Caching configuration for production..."
# Create new cache files based on the production environment
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Supervisor..."
# Start Nginx and PHP-FPM services
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
