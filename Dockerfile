FROM php:8.2-fpm-alpine

WORKDIR /var/www

RUN apk add --no-cache \
    bash curl git nodejs npm \
    build-base autoconf libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev postgresql-dev oniguruma-dev \
    nginx supervisor && \
    rm -rf /var/cache/apk/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Install PHP deps first
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install Node deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --prefer-offline

# Copy rest of code
COPY . .

# Build frontend assets
RUN npm run build && npm cache clean --force

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/build

COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
