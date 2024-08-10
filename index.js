const express = require('express')
const session = require('express-session');
const passport = require('./passportConfig');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const swaggerSpec = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

app.use('/orders', passport.authenticate('local', { session:false }), orderRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});