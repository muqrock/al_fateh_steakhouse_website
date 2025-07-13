# Use official PHP image with extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    nginx \
    nodejs \
    npm \
    supervisor \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev

# Install PHP extensions (including PostgreSQL)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# ✅ Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

ENV APP_URL=https://al-fateh-steakhouse-website.onrender.com

# ✅ Install frontend (Vite React) and build assets
RUN npm install && npm run build

# ✅ Set correct permissions
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# ✅ Copy Nginx config and Supervisor config
COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ✅ Expose HTTP port
EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ✅ Start Supervisor to manage PHP-FPM and Nginx
CMD ["/entrypoint.sh"]
