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

# --- CRITICAL PERMISSION FIXES (Re-introducing mkdir -p) ---

# Diagnostic: Check the current user and group during the Docker build step
RUN echo "DEBUG (Dockerfile build): Current user is $(whoami), Current ID is $(id)"

# STEP 1: Create all necessary runtime directories
# This must happen BEFORE any chown/chmod on these specific paths
RUN mkdir -p /var/www/storage/app/public \
             /var/www/storage/framework/cache/data \
             /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/logs \
             /var/www/bootstrap/cache \
             /var/www/public/build
# Diagnostic: Confirm directories were created
RUN echo "DEBUG (mkdir completed). Listing contents of /var/www:" \
    && ls -ld /var/www/storage /var/www/bootstrap/cache /var/www/public/build \
    && ls -l /var/www/storage/framework/views

# STEP 2: Set ownership for the entire /var/www directory to 'nobody:nogroup'.
# This is generally the safest unprivileged user/group in Alpine for web processes.
RUN chown -R nobody:nogroup /var/www
# Diagnostic: Confirm ownership change
RUN echo "DEBUG (chown completed). Listing contents of /var/www with ownership:" \
    && ls -ld /var/www/storage /var/www/bootstrap/cache /var/www/public/build \
    && ls -l /var/www/storage/framework/views

# STEP 3: Set base permissions for all files and directories under /var/www
# Directories will be 755 (owner rwx, group rx, others rx)
# Files will be 644 (owner rw, group r, others r)
RUN find /var/www -type d -exec chmod 755 {} + \
    && find /var/www -type f -exec chmod 644 {} +
# Diagnostic: Confirm general permissions
RUN echo "DEBUG (general chmod completed). Listing contents of /var/www with permissions:" \
    && ls -ld /var/www/storage /var/www/bootstrap/cache /var/www/public/build \
    && ls -l /var/www/storage/framework/views

# STEP 4: Explicitly ensure specific Laravel writable directories are group-writable (775)
# This command *must* come after the general find/chmod commands to override them for these paths.
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

# --- FIX: Run as nobody user to match storage ownership ---
USER nobody

EXPOSE 80

CMD ["/entrypoint.sh"]