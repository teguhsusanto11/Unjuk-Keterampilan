const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Buat koneksi ke MySQL
const dbConfig = {
    host: 'localhost',
    user: 'teguh',
    password: 'teguh1111',
    database: 'database_product'
};

// Route untuk menampilkan halaman produk
router.get('/products', async (req, res) => {
    // Buat koneksi ke MySQL
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Ambil data produk dari database
        const [rows] = await connection.execute('SELECT * FROM products');
        
        res.render('products', { products: rows }); // Kirim data produk ke template
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Tutup koneksi setelah selesai
    }
});

module.exports = router;
