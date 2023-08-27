const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login'); // Merender template login.ejs
});

module.exports = router;