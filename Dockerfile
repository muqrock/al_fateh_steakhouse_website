FROM php:8.2-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache \
    bash curl git nodejs npm \
    build-base autoconf libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev postgresql-dev oniguruma-dev \
    nginx supervisor

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copy everything early
COPY . .

# Build PHP deps
RUN composer install --no-dev --optimize-autoloader

# Build Vite assets
RUN npm install && npm run build && npm cache clean --force

# Fix permissions
RUN mkdir -p storage/framework/{cache,data,sessions,views} storage/logs bootstrap/cache public/build && \
    chown -R www-data:www-data storage bootstrap/cache public/build

COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
