FROM php:8.2-fpm

WORKDIR /var/www

# ✅ Make sure your production .env is copied in
COPY .env /var/www/.env


# Install Node.js 20 (needed for Vite + React)
RUN apt-get update && apt-get install -y curl gnupg2 \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# System dependencies
RUN apt-get install -y \
    build-essential libpng-dev libonig-dev libxml2-dev zip unzip git \
    nginx supervisor libpq-dev libjpeg-dev libfreetype6-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# START OF NEW DIAGNOSTIC STEP:
# ✅ Check PHP-FPM's listen address to diagnose 502 Bad Gateway
RUN grep -r "listen =" /etc/php/8.2/fpm/pool.d/www.conf || true
# END OF NEW DIAGNOSTIC STEP

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ✅ Copy full app first (so artisan exists before composer install)
COPY . .

# ✅ Install Laravel backend dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# ✅ Build Vite React frontend
RUN npm install && npm run build

# START OF PREVIOUS DIAGNOSTIC STEPS (keep these for now):
# ✅ Confirm vite manifest exists in the right place
RUN ls -lah /var/www/public/build/.vite
# ✅ Confirm assets exist inside the assets directory
RUN ls -lah /var/www/public/build/assets
# END OF PREVIOUS DIAGNOSTIC STEPS

# ✅ Set permissions (important for storage and logs)
RUN chown -R www-data:www-data /var/www && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# ✅ Copy server config
COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ✅ Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]