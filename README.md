# KeyCraft Backend

A scalable NestJS backend powering the KeyCraft e-commerce platform with authentication, Stripe payments, cart management, and admin order, user control.

---

# Features

- JWT Authentication
- Refresh Token System
- Role-based Authorization
- Product CRUD
- Wishlist System
- Cart System
- Stripe Checkout Integration
- Order Management
- Payment Verification
- Admin Order Control
- MongoDB Integration

---

# Tech Stack

## Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose

## Authentication

- JWT
- Passport.js
- bcrypt

## Payment

- Stripe API

---

# Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

STRIPE_SECRET_KEY=your_stripe_secret

CLIENT_URL=http://localhost:3000
```

---

# Installation

```bash
git clone <git@github.com:Priyanka-Das-Dipa/mechanical_keyboard_shop_server.git>

cd mechanical_keyboard_shop_server

npm install
```

---

# Run Development Server

```bash
npm run start:dev
```

---

# Build Project

```bash
npm run build
```

---

# API Modules

## Auth Module

- Register
- Login
- Refresh Token
- Protected Routes

## Product Module

- Create Product
- Update Product
- Delete Product
- Get Products
- Filtering & Search

## User Module

- Wishlist
- Cart
- Checkout
- Orders

---

# Stripe Payment Flow

1. User adds products to cart
2. Checkout session created
3. Stripe hosted payment page
4. Payment verification
5. Order stored in database
6. Cart cleared automatically

---

# Security Features

- Password hashing
- JWT authentication
- Route guards
- DTO validation
- Environment variable protection

---

# Database Collections

- Users
- Products
- Orders

---

# Admin Features

- Manage Products
- View All Orders
- Update Order Status
- Manage User

---

# Author

Priyanka Das Dipa

Web Developer
