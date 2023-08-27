/*
    1. Buat rute untuk halaman kelola akun di file routes/account.js.
    2. Pastikan rute tersebut hanya dapat diakses oleh pengguna yang sudah login (gunakan middleware untuk verifikasi sesi).
    3. Tampilkan halaman kelola akun dengan informasi pengguna yang dapat diedit.
    4. Ketika formulir edit akun di-submit, tangkap data dari formulir di sisi server.
    5. Perbarui informasi akun pengguna di database sesuai dengan data yang diterima.
    6. Redirect pengguna ke halaman kelola akun setelah berhasil perbarui.
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
    database: 'database_akun'
};

// Route untuk menampilkan halaman kelola akun
router.get('/account', (req, res) => {
    // memastikan pengguna sudah login sebelum mengakses halaman ini
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('account', { user: req.session.user });
});

// Route untuk memproses perubahan akun
router.post('/account', async (req, res) => {
    const { username, newPassword } = req.body;

    // Buat koneksi ke MySQL
    const connection = await mysql.createConnection(dbConfig);

    try {
        // Pastikan pengguna sudah login sebelum melakukan perubahan
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Cari pengguna berdasarkan username
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).send('User not found');
        }

        // Hash password baru menggunakan bcrypt sebelum menyimpannya
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password di database
        await connection.execute('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

        // Redirect pengguna ke halaman kelola akun setelah perubahan berhasil
        req.session.user = user; // Anda mungkin ingin mengubah informasi sesi juga
        res.redirect('/account');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Tutup koneksi setelah selesai
    }
});

module.exports = router;
