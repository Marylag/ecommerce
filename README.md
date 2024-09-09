# E-commerce Application

## Description
This is a full-stack e-commerce application that allows users to browse products, add items to a cart, make payments via Stripe, and manage orders. It also includes authentication via email/password and Google OAuth.

## Features
- User authentication (Login, Registration, and Google OAuth)
- Browsing products and viewing product details
- Add, update, and remove items from the shopping cart
- Checkout process using Stripe payment gateway
- View order history after successful purchase
- Admin functionality to manage products and orders (if applicable)
- JWT-based authentication with refresh tokens
- Session management using `express-session` and PostgreSQL

## Technologies Used
- **Frontend:** React, React Router, Axios, CSS (custom styling)
- **Backend:** Node.js, Express.js, Passport.js
- **Database:** PostgreSQL
- **Authentication:** JWT, Passport (Local & Google OAuth)
- **Payment Gateway:** Stripe
- **Session Management:** express-session and connect-pg-simple
- **Environment Management:** dotenv
- **API Documentation:** Swagger

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app
```

### 2. Backend Setup
Install dependencies for the backend.

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```makefile
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

Create the PostgreSQL tables for users, products, orders, sessions, etc.

Run database migrations (if applicable):
```bash
npx knex migrate:latest
```

Start the backend server:
```bash
node index.js
```

The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Install dependencies for the frontend:
```bash
cd frontend
npm install
```
In the frontend directory, create a .env file with the following variables:
```bash
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

Start the frontend server:
```bash
npm start
```

The frontend will be available on `http://localhost:3000`.

### 4. Stripe Setup

- Go to the [Stripe Dashboard](https://dashboard.stripe.com/).
- Obtain your Stripe secret key and public key.
- Add your keys to the `.env` files in both the backend (`STRIPE_SECRET_KEY`) and frontend (`REACT_APP_STRIPE_PUBLIC_KEY`).

## API Documentation

This project uses Swagger for API documentation.

After running the backend server, you can access the API documentation at:

```bash
http://localhost:5000/api-docs
```

## Testing

To test the application:

- Register a new user or log in with an existing account.
- Add products to the cart and proceed to checkout using Stripe.
- Check the order history after a successful payment.

## Contributing

Feel free to open issues or submit pull requests if you would like to contribute to this project.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact `laguta113@gmail.com`.
