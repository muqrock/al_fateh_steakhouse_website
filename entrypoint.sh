#!/bin/bash
set -e

echo "Creating necessary Laravel directories (if not already present)..."
# These mkdir -p commands are still useful here if /var/www is a volume,
# ensuring directories exist before Laravel tries to write to them.
mkdir -p \
  /var/www/storage/app/public \
  /var/www/storage/framework/cache/data \
  /var/www/storage/framework/sessions \
  /var/www/storage/framework/views \
  /var/www/storage/logs \
  /var/www/bootstrap/cache

# Create log file if it doesn't exist and ensure permissions (important for fresh deployments)
touch /var/www/storage/logs/laravel.log

# Permissions are now primarily handled in Dockerfile, but this ensures group writability at runtime
# (This is a fallback/reinforcement, mainly for volume mounts)
chmod -R ug+rwX /var/www/storage /var/www/bootstrap/cache

echo "Linking storage directory..."
php artisan storage:link

echo "Running database migrations..."
# Use set +e / set -e to allow migration to fail without stopping the entrypoint
set +e
php artisan migrate --force
MIGRATE_EXIT_CODE=$?
set -e

if [ $MIGRATE_EXIT_CODE -ne 0 ]; then
  echo "⚠️ Migration failed or had errors (likely due to duplicate tables). Continuing deployment..."
fi

# Optional: Remove cache logic if it's giving you issues
# echo "Clearing stale caches..."
# php artisan config:clear
# php artisan cache:clear
# php artisan route:clear
# php artisan view:clear

# echo "Caching configuration for production..."
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# Removed: "Setting permissions for Vite build output..." and associated chown/chmod
# These are now handled in the Dockerfile during the build phase.

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf