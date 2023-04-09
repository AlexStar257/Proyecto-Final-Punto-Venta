const express = require('express');

const router = express.Router();

const productosController = require('../controllers/productosController');

router.get('/productos', productosController.list);
router.post('/add', productosController.save)
module.exports = router;