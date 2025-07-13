#!/bin/bash

# Run Laravel cache commands
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Supervisor
exec /usr/bin/supervisord
