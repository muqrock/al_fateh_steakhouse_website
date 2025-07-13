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

# --- CRITICAL PERMISSION FIXES (Final attempt based on logs) ---

# Diagnostic: Check the current user and group during the Docker build step
RUN echo "DEBUG (Dockerfile build): Current user is $(whoami), Current ID is $(id)"

# Set ownership for the entire /var/www directory to 'nobody:nogroup'.
# This is generally the safest unprivileged user/group in Alpine for web processes.
RUN chown -R nobody:nogroup /var/www

# Set base permissions for all files and directories under /var/www
# Directories will be 755 (owner rwx, group rx, others rx)
# Files will be 644 (owner rw, group r, others r)
RUN find /var/www -type d -exec chmod 755 {} + \
    && find /var/www -type f -exec chmod 644 {} +

# Explicitly ensure specific Laravel writable directories are group-writable (775)
# This command *must* come after the general find/chmod commands to override them.
RUN chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/public/build

# Diagnostic: Check permissions and ownership *after* all chown and chmod operations
RUN echo "DEBUG (Permissions after FINAL chown/chmod):" \
    && ls -ld /var/www/storage /var/www/bootstrap/cache /var/www/public \
    && ls -l /var/www/storage/framework/views \
    && ls -l /var/www/public/build/manifest.json 2>/dev/null || echo "manifest.json still not found in /var/www/public/build/"

# --- END CRITICAL PERMISSION FIXES ---

# Copy Nginx and Supervisor configurations
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy and make entrypoint executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]