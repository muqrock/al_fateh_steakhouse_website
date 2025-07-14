#!/bin/bash
set -e

# Change to the application directory
cd /var/www

# Create necessary Laravel directories if not already present
echo "Creating necessary Laravel directories (if not already present)..."
mkdir -p storage/app storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache public/build

# Link storage directory (if not already linked)
echo "Linking storage directory..."
php artisan storage:link || true # Use || true to prevent error if already linked

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Set permissions for Laravel writable directories
# This needs to be run at runtime because volumes or other operations
# might affect permissions after the build step.
echo "Setting permissions for Laravel writable directories..."

# Ensure ownership of ALL critical Laravel writable directories is www-data:www-data
# This covers storage and bootstrap/cache recursively
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Set general group-writable permissions (rwx for owner and group, rx for others)
# This will apply to directories (775) and files (664) within these paths.
chmod -R ug+rwX /var/www/storage /var/www/bootstrap/cache

# !!! NEW: Specific permissions for the logs directory and files !!!
# This is to ensure that even if laravel.log is created by root, it's writable by www-data
echo "Ensuring permissions for /var/www/storage/logs..."
chown -R www-data:www-data /var/www/storage/logs # Explicitly set ownership
chmod -R 775 /var/www/storage/logs            # Ensure directory is writable by owner/group
find /var/www/storage/logs -type f -exec chmod 664 {} + # Ensure existing log files are writable

# Diagnostic for runtime permissions:
echo "DEBUG (Entrypoint runtime): Current user is $(whoami), Current ID is $(id)"
echo "DEBUG (Entrypoint runtime): Permissions of /var/www/storage and /var/www/storage/logs:"
ls -ld /var/www/storage /var/www/storage/logs
ls -l /var/www/storage/logs/laravel.log 2>/dev/null || echo "laravel.log not found yet in storage/logs (will be created)"

# Start Supervisor
echo "Starting Supervisor..."
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf