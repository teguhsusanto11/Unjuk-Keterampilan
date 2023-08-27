const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const productsRoutes = require('./routes/products');

const app = express();

// Konfigurasi session
app.use(session({
    secret: 'jUmKLKSLKiislMKLijkslK',
    resave: false,
    saveUninitialized: true
}));

// Middleware untuk membaca data dari form
app.use(express.urlencoded({ extended: true }));

// Set template engine dan folder views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gunakan rute-rute yang telah dibuat
app.use(authRoutes);
app.use(accountRoutes);
app.use(productsRoutes);

// Server mendengarkan pada port tertentu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});