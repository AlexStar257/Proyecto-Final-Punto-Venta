const express = require('express');

const router = express.Router();

const productosController = require('../controllers/productosController');

router.get('/productos', productosController.list);
router.post('/add', productosController.save);
router.get('/delete/:id', productosController.delete);
router.get('/update/:id', productosController.edit);
router.post('/update/:id', productosController.update);
router.get('/buscar', productosController.buscar);
router.get('/estado/:id', productosController.estado);
module.exports = router;