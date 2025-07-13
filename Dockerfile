FROM php:8.2-fpm-alpine

WORKDIR /var/www

# Install Node.js, Git, and other system dependencies for Alpine
RUN apk add --no-cache \
    bash curl git nodejs npm \
    build-base autoconf libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev postgresql-dev oniguruma-dev \
    nginx supervisor && \
    rm -rf /var/cache/apk/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

# Copy Composer executable
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy all application files including artisan
COPY . .

# Run composer install
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install Node dependencies
RUN npm ci --no-audit --prefer-offline

# Build frontend assets
RUN npm run build && npm cache clean --force

# --- CRITICAL PERMISSION FIXES (Consolidated and Corrected for Alpine) ---
# Ensure all necessary runtime directories exist
RUN mkdir -p /var/www/storage/app/public \
             /var/www/storage/framework/cache/data \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/logs \
             /var/www/bootstrap/cache \
             /var/www/public/build

# Set ownership to 'nginx' user/group (common for Alpine web servers)
# We'll set /var/www to nginx:nginx, then specifically ensure 'storage' and 'bootstrap/cache' are writable.
RUN chown -R nginx:nginx /var/www

# Set general permissions:
# Directories: rwx for owner, rx for group/others (755)
# Files: rw for owner, r for group/others (644)
RUN find /var/www -type d -exec chmod 755 {} + \
    && find /var/www -type f -exec chmod 644 {} + \
    # Ensure storage/bootstrap/cache are writable by the group (and owner)
    # This is crucial for Laravel to write session, cache, and view files.
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache
# --- END CRITICAL PERMISSION FIXES ---
# --- END CRITICAL PERMISSION FIXES ---

# Copy Nginx and Supervisor configurations
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy and make entrypoint executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]