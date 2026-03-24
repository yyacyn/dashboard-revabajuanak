# Reva Baju Anak — E-Commerce Platform

> Full-stack e-commerce platform and admin dashboard for **Reva Baju Anak**.  
> Provides a complete digital storefront for customers and a specialized inventory/order management dashboard for administrators.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Admin Dashboard** | React 18, Vite, TailAdmin Template |
| **Backend** | Go (Gin), PostgreSQL, JWT Authentication |
| **Media / Storage** | Local Multipart Uploads |

---

## Key Features

### 🛍️ Client Storefront
- **Product Catalog** — Browse clothing items with variations in sizes and stock
- **Shopping Cart** — Add, update, and remove items with real-time stock validations
- **Order Management** — Checkout process and individual order history tracking
- **User Profiles** — Manage personal details, addresses, and email verification

### 📊 Admin Dashboard
- **Product & Inventory Management** — Full CRUD for products, size variations, and image uploads
- **Order Processing** — Track incoming orders, manage statuses, and view complete transaction details
- **User Management** — View and manage registered customers and their data

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control
- Two distinct roles: **Admin** (inventory/order management) and **User** (shopping/checkout)
- Email verification system for new user registrations

---

## Architecture

```text
┌─────────────────┐     ┌─────────────────┐
│ Client Store    │     │ Admin Dashboard │
│ React + Vite    │     │ React + Vite    │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └────────────┬───────────┘
                      │
              ┌───────▼────────┐
              │   Go Backend   │
              │   Gin + JWT    │
              │   REST API     │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │   PostgreSQL   │
              │   11 Tables    │
              │   Auto-migrate │
              └────────────────┘
```

---

## Backend API Overview

**25+ RESTful endpoints** managed by Go (Gin):

| Domain | Endpoints | Highlights |
|--------|-----------|------------|
| Auth | Login, Register, Verify | Admin vs User separation, JWT via headers |
| Products | CRUD, Sizes, Uploads | Multipart file uploads (3MB limit), stock junction tables |
| Cart | Add, Update, Remove | Protected routes, cart-to-order transition logic |
| Orders | Checkout, Webhooks | Payment notifications webhook, order status updates |
| Users | Profile, History | Relational mapping via `user_details` |

---

## Database Schema

11 inter-connected tables utilizing automated Go struct migrations:

`users` · `user_details` · `produks` · `ukurans` · `produk_ukuran_stocks` · `carts` · `cart_details` · `orders` · `order_details` · `payments` · `ulasans`

---

## Notable Technical Decisions

- **Relational Stock Management** — Utilized junction tables (`produk_ukuran_stocks`) to accurately map specific stock quantities to distinct size variations per product.
- **Payment Webhook Integration** — Designed a secure `/payment/notification/:id` endpoint to ingest external payment gateway updates asynchronously.
- **Cart-to-Order Pipeline** — Seamless transactional transition from temporary user carts to permanent immutable orders upon checkout.
- **Role-Based Middlewares** — Custom Gin middleware (`AuthMiddleware`) to restrict access based on extracted JWT claims.

---

## How to Run Locally

### 1. Frontend Setup
1. Clone the repository.
2. Run `npm install` in the root directory to install dependencies.
3. Run `npm run dev` to start the frontend development server on port 5173.

### 2. Backend Setup
1. Navigate to the `backend-go-gin` directory.
2. Make sure you have Go and PostgreSQL installed.
3. Configure your database connection in the environment configurations.
4. Run `go run main.go` to start the backend Gin server on port 8000.