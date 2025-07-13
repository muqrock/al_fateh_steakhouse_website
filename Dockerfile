FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    build-essential libpng-dev libonig-dev libxml2-dev zip unzip curl git \
    nginx nodejs npm supervisor libpq-dev libjpeg-dev libfreetype6-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

ENV APP_URL=https://al-fateh-steakhouse-website.onrender.com

# ✅ Force production build
RUN npm install && npm run build

# ✅ Double check manifest exists
RUN ls -lah public/build

# ✅ Set correct permissions
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
