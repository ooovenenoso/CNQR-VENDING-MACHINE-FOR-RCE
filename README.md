
## Overview

Welcome to the **CNQR Vending Machine Frontend** application. This React-based frontend allows users to log in using their Discord accounts, view their Venom Goo balance, purchase Venom Goo using Stripe payments, and buy in-game products (kits) using their balance.

The application interacts with a Node.js backend that handles authentication, payment processing, and data management.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Backend Integration](#backend-integration)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Discord Authentication**: Users can log in using their Discord accounts.
- **Venom Goo Balance**: Display users' in-game currency balance.
- **Stripe Integration**: Secure payment processing to purchase Venom Goo.
- **Product Purchase**: Users can spend their Venom Goo to buy in-game products.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** and **npm** installed on your machine.
- Access to the backend API (details provided below).
- A Stripe account with test keys.
- Discord application credentials for OAuth2.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ooovenenoso/CNQR-VENDING-MACHINE-FOR-RCE.git
   cd cnqr-vending-machine-main
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```dotenv
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

- `REACT_APP_BACKEND_URL`: The URL of the backend API.
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key.

**Note**: Do not include sensitive keys (like secret keys) in your frontend code.

## Running the Application

To start the development server:

```bash
npm start
```

The application will run on `http://localhost:3000` by default.

## Deployment

For deployment, you can use platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### Deploying to Vercel

1. **Install Vercel CLI (Optional)**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Set Environment Variables**

   In your Vercel dashboard, navigate to your project settings and add the environment variables under the **Environment Variables** section.

## Backend Integration

The frontend communicates with a Node.js backend server that handles:

- **Authentication**: Manages Discord OAuth2 login and user sessions.
- **Payment Processing**: Handles Stripe payment intents and webhooks.
- **Data Management**: Reads and writes user data from CSV files.

**Important Endpoints:**

- `GET /api/auth/user`: Retrieves authenticated user data.
- `POST /api/create-payment-intent`: Creates a Stripe payment intent.
- `POST /api/purchase/product`: Processes product purchases using Venom Goo.

Ensure that the backend server is running and accessible at the URL specified in `REACT_APP_BACKEND_URL`.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Changes**

   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the **MIT License**.

## Acknowledgments

- **React**: JavaScript library for building user interfaces.
- **Stripe**: Payment processing platform.
- **Discord OAuth2**: Used for user authentication.
- **Axios**: Promise-based HTTP client for the browser.

---

If you have any questions or need assistance, feel free to contact the project maintainers.
