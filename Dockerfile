# --- FRONTEND BUILD STAGE ---
FROM node:18-alpine as frontend

WORKDIR /app

COPY package*.json vite.config.ts ./
COPY resources ./resources
COPY public ./public

# Install dependencies and build frontend assets
RUN rm -rf public/build
RUN npm install
RUN npm run build

# --- BACKEND + LARAVEL STAGE ---
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    unzip \
    libpng-dev \
    libxml2-dev \
    oniguruma-dev \
    libzip-dev \
    postgresql-dev \
    bash \
    shadow \
    nodejs \
    npm \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring zip bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy full Laravel project
COPY . .

# Copy built frontend assets from frontend stage
COPY --from=frontend /app/public/build ./public/build

# Set correct permissions
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel
RUN chown -R laravel:laravel /var/www

# Install backend dependencies
RUN composer install --no-dev --optimize-autoloader

# Laravel optimizations
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

USER laravel

EXPOSE 8000

# Start Laravel development server (can customize if you're using Nginx)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]