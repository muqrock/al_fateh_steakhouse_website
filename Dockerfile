FROM php:8.2-fpm

WORKDIR /var/www

# Install cURL and GnuPG for NodeSource setup, and then install Node.js v20 (LTS)
# This ensures you get a Node.js version compatible with your React Router and Vite dependencies.
RUN apt-get update && apt-get install -y curl gnupg2 \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Continue with other essential system packages
RUN apt-get install -y \
    build-essential libpng-dev libonig-dev libxml2-dev zip unzip git \
    nginx supervisor libpq-dev libjpeg-dev libfreetype6-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

ENV APP_URL=https://al-fateh-steakhouse-website.onrender.com

# ✅ Force production build
# This step will now use Node.js v20.x, which should resolve the EBADENGINE warnings.
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