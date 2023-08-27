/*
    1. Buat rute untuk halaman login di file routes/auth.js.
    2. Di rute tersebut, tampilkan halaman login dengan menggunakan template engine.
    3. Ketika formulir login di-submit, tangkap data dari formulir di sisi server.
    4. Verifikasi kredensial pengguna dengan data di database menggunakan paket bcrypt.
    5. Jika kredensial valid, buat sesi menggunakan express-session untuk menyimpan informasi login.
    6. Redirect pengguna ke halaman tertentu setelah berhasil login.
*/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Buat koneksi ke MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'pass123',
    database: 'database'
};

// Route untuk menampilkan halaman login
router.get('/login', (req, res) => {
    res.render('login');
});

// Route untuk memproses login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).send('Username not found');
    }

    // Bandingkan password yang diinput dengan password di database (dengan bcrypt)
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (!result) {
            return res.status(401).send('Invalid password');
        }
        
        // Simpan informasi pengguna dalam sesi (atau gunakan mekanisme otentikasi yang lebih kuat)
        req.session.user = user;
        res.redirect('/profile'); // halaman setelah login berhasil
    });
});

module.exports = router;

/*
    1. Buat rute untuk halaman signup di file routes/auth.js.
    2. Di rute tersebut, tampilkan halaman signup dengan formulir registrasi.
    3. Ketika formulir signup di-submit, tangkap data dari formulir di sisi server.
    4. Enkripsi password menggunakan bcrypt sebelum menyimpannya di database.
    5. Simpan data pengguna (seperti nama, email, dan password yang dienkripsi) ke database.
    6. Setelah berhasil registrasi, redirect pengguna ke halaman login.
*/
// Route untuk menampilkan halaman signup
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Route untuk memproses signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Buat koneksi ke MySQL
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Cek apakah pengguna dengan username sudah ada
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).send('Username already exists');
        }

        // Hash password menggunakan bcrypt sebelum menyimpannya
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan data pengguna baru ke database
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.redirect('/login'); // Redirect ke halaman login setelah signup berhasil
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Tutup koneksi setelah selesai
    }
});