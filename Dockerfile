# Use the official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

COPY . /var/www/html

# Copy .env.example as .env (Render sets env vars, but this helps with artisan commands)
COPY .env.example .env

# Install Composer dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Generate Laravel key (if not set by Render env)
RUN php artisan key:generate || true

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Optimize Laravel
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install npm dependencies and build assets
RUN npm install && npm run build

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
