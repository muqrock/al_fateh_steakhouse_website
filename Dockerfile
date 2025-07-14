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

# ... (your existing Dockerfile content)

# --- CRITICAL PERMISSION FIXES ---

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

# STEP 2: Set ownership for the entire /var/www directory to 'www-data:www-data'.
# THIS IS THE CRITICAL CHANGE: Align with PHP-FPM's default user in this base image.
RUN chown -R www-data:www-data /var/www # <--- CHANGE THIS LINE
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

# ... (rest of your Dockerfile, which looks good)

# --- NEW: Ensure Nginx has access to its working directories ---
# Nginx typically runs as the 'nginx' user (UID/GID 101) in Alpine.
# It needs write access to its cache and run directories.
RUN mkdir -p /var/cache/nginx /var/run/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/run/nginx && \
    chmod -R 755 /var/cache/nginx /var/run/nginx

# Copy Nginx and Supervisor configurations with correct ownership for files
# Nginx config should be readable by nginx user. Supervisor/entrypoint by root.
COPY --chown=nginx:nginx docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY --chown=root:root docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# It's good practice to place entrypoint in /usr/local/bin
COPY --chown=root:root entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# --- REMOVED: USER nobody ---
# Nginx and Supervisor typically start as root, then Nginx drops privileges.
# Setting USER nobody here might prevent Supervisor/Nginx from starting correctly.
# Leave the default user as root for running the entrypoint.

EXPOSE 80

# Use ENTRYPOINT instead of CMD for a consistent and robust container launch
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# CMD is now optional. If you had additional arguments for the entrypoint, they'd go here.
# CMD []