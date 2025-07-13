FROM php:8.2-fpm

WORKDIR /var/www

# --- System Dependencies ---
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip unzip curl git nginx \
    nodejs npm supervisor \
    libpq-dev libjpeg-dev libfreetype6-dev

# --- PHP Extensions ---
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# --- Composer ---
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --- Copy only composer files first for caching ---
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# --- Copy rest of the app ---
COPY . .

# --- Set environment ---
ENV APP_URL=https://al-fateh-steakhouse-website.onrender.com

# ✅ Build frontend (after full app exists)
RUN npm install && npm run build

# ✅ Set permissions
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# ✅ Copy configs
COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ✅ Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
