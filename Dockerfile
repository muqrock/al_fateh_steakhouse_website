# Use official PHP image with FPM and Alpine base
FROM php:8.2-fpm-alpine

WORKDIR /var/www

# 1. Install system dependencies first
RUN apk add --no-cache --update \
    bash \
    curl \
    git \
    # Node.js (using current stable from Alpine repos)
    nodejs \
    npm \
    # Build dependencies
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
    supervisor

# 2. Configure PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# 3. Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# 4. Copy application files
COPY . .

# 5. Install backend dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# 6. Install frontend dependencies
RUN npm ci --no-audit --prefer-offline && \
    npm run build && \
    npm cache clean --force

# 7. Set permissions
RUN chown -R www-data:www-data \
    /var/www/storage \
    /var/www/bootstrap/cache \
    /var/www/public/build

# 8. Copy configurations
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]