# Simple E-commerce Application

A modern e-commerce storefront and admin management platform built with **Laravel**, **Inertia.js v3**, **React**, **TypeScript**, **Tailwind CSS**, and **Spatie Laravel Permission**.

---

## Features

- **Storefront**: Browse catalog by categories and subcategories with instant filtering and search.
- **Product Management**: Multi-category association, pricing with automatic discount calculation, and product image uploads.
- **Role-Based Access Control**: Powered by `spatie/laravel-permission` with dedicated `admin`.
- **Automated CI/CD**: GitHub Actions workflows for linting, static analysis, unit/feature tests, and automated VPS deployment via SSH/Rsync.

---

## Tech Stack & Tested Environment

- **PHP**: Tested on `8.5.12`
- **Composer**: Tested on `2.10.3`
- **Node.js**: Tested on `26.12.1` & **npm**
- **Database**: MySQL / MariaDB (or SQLite for quick local/testing use)

---

## Local Development Setup

Follow these steps to get the project running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/mhrsifat/simple-ecommerce.git
cd simple-ecommerce
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Setup Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and set your local database credentials (e.g. for MySQL):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simple_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

_(Or keep `DB_CONNECTION=sqlite` and create an empty database file with `touch database/database.sqlite`)_

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Link Public Storage

Required for product image storage and retrieval:

```bash
php artisan storage:link
```

### 6. Run Migrations & Seeders

Run fresh migrations and populate roles, permissions, categories, and products:

```bash
php artisan migrate:fresh --seed
```

#### Seeded Credentials

| Role         | Email                       | Password   |
| :----------- | :-------------------------- | :--------- |
| **Admin**    | `admin@banglapuzzle.com`    | `password` |

### 7. Install & Build Frontend Assets

```bash
npm install
npm run dev
```

### 8. Run the Application

In a separate terminal:

```bash
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Code Quality & Testing

Run the full automated test suite:

```bash
php artisan test
```

Run code formatting and static analysis checks:

```bash
# Auto-fix PHP code style
./vendor/bin/pint

# Run PHPStan static analysis
./vendor/bin/phpstan analyse

# Run all project checks
composer ci:check
```

---

## VPS / Production Deployment (CloudPanel / Ubuntu)

### Step 1: Create a Site in CloudPanel

1. Log into your CloudPanel dashboard.
2. Click **+ Add Site** $\rightarrow$ Select **Create a PHP Site** or **Laravel Site**.
    - **Application**: `Laravel` (or `Generic` with root set to `/public`)
    - **Domain Name**: e.g., `simple-ecommerce.mhrsifat.app`
    - **PHP Version**: `PHP 8.3` or `PHP 8.4` or `PHP 8.5`
    - **Site User**: e.g., `mhrsifat-simple-ecommerce`
    - **Site User Password**: Save the generated password securely.
3. Note the site root path (e.g., `htdocs/simple-ecommerce.mhrsifat.app`).

### Step 2: Configure Cloudflare DNS

1. In Cloudflare, navigate to your domain DNS settings.
2. Add an **A record**:
    - **Name**: `simple-ecommerce` (or `@` for root domain)
    - **IPv4 Address**: Your VPS server public IP address
    - **Proxy Status**: `Proxied` (orange cloud)
    - **TTL**: `Auto`
3. In Cloudflare **SSL/TLS**, set mode to **Full** or **Full (Strict)**.

### Step 3: Configure GitHub Secrets for Auto-Deployment

In your GitHub repository, go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ **New repository secret**:

| Secret Name    | Value                                  | Description                              |
| :------------- | :------------------------------------- | :--------------------------------------- |
| `SSH_HOST`     | `YOUR_SERVER_IP`                       | Server public IPv4 address               |
| `SSH_USER`     | `mhrsifat-simple-ecommerce`            | SSH user created in CloudPanel           |
| `SSH_PASSWORD` | `YOUR_SSH_PASSWORD`                    | SSH user password                        |
| `DEPLOY_PATH`  | `htdocs/simple-ecommerce.mhrsifat.app` | Relative to user home (no leading slash) |
| `SSH_PORT`     | `22`                                   | Optional (defaults to 22)                |

### Step 4: Configure Production Database on Server (One-time)

1. In CloudPanel, go to **Databases** $\rightarrow$ **Add Database**.
    - **Database Name**: e.g. `simple_ecommerce_prod`
    - **Database User**: e.g. `db_user`
    - **Password**: Generate secure password
2. SSH into your server:
    ```bash
    ssh mhrsifat-simple-ecommerce@YOUR_SERVER_IP
    cd ~/htdocs/simple-ecommerce.mhrsifat.app
    ```
3. Edit the `.env` file on the server:
    ```bash
    nano .env
    ```
    Update production values:
    ```env
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://simple-ecommerce.mhrsifat.app

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=simple_ecommerce_prod
    DB_USERNAME=db_user
    DB_PASSWORD=YOUR_DB_PASSWORD
    ```
4. Run initial database migration and seed on server:
    ```bash
    php artisan migrate --force
    php artisan db:seed --force
    ```

### Step 5: Automatic Continuous Deployment

Every push to the `main` branch automatically:

1. Runs tests and linters in GitHub Actions (`tests.yml`).
2. Syncs updated files via Rsync (excluding `.env`, cache, and logs).
3. If `.env` is missing on the server, automatically copies `.env.example` and generates an `APP_KEY`.
4. Runs `composer install --no-dev --optimize-autoloader`.
5. Runs `npm ci` and `npm run build` directly on the server.
6. Runs `php artisan migrate --force`, and automatically runs `php artisan db:seed --force` on the first deployment.
7. Refreshes application cache (`php artisan optimize`).
8. Gracefully restarts queue workers and services.
