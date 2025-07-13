# Use official PHP image with FPM and Alpine base (smaller footprint)
FROM php:8.2-fpm-alpine

WORKDIR /var/www

# Install dependencies in a single RUN layer (reduces image size)
RUN apk add --no-cache --update \
    # Base packages
    bash \
    curl \
    git \
    # Node.js 20 (for Vite)
    nodejs=20.12.2-r0 \
    npm \
    yarn \
    # Build dependencies (removed after compile)
    build-base \
    autoconf \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    postgresql-dev \
    oniguruma-dev \
    # Runtime dependencies
    nginx \
    supervisor \
    # Cleanup
    && rm -rf /var/cache/apk/*

# Configure PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    # Clean build dependencies
    && apk del build-base autoconf

# Verify PHP-FPM configuration (for debugging)
RUN echo "PHP-FPM Config:" && \
    grep -r "listen =" /etc/php82/php-fpm.d/www.conf || true

# Install Composer (multi-stage to reduce image size)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy application files (with .dockerignore to exclude unnecessary files)
COPY . .

# Install backend dependencies (no dev dependencies)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install frontend dependencies and build
RUN npm ci --no-audit --prefer-offline && \
    npm run build && \
    npm cache clean --force

# Verify build output
RUN ls -lah /var/www/public/build && \
    ls -lah /var/www/public/build/assets

# Set permissions (optimized for least privilege)
RUN chown -R www-data:www-data \
    /var/www/storage \
    /var/www/bootstrap/cache \
    /var/www/public/build \
    && find /var/www/storage -type d -exec chmod 775 {} \; \
    && find /var/www/storage -type f -exec chmod 664 {} \;

# Copy configurations
COPY --chown=www-data:www-data \
    ./docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY --chown=root:root \
    ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY --chown=root:root \
    entrypoint.sh /entrypoint.sh

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/healthz || exit 1

EXPOSE 80

CMD ["/entrypoint.sh"]