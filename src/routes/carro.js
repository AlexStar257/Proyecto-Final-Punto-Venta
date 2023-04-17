const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

const carroController = require('../controllers/carroController');

router.get('/carro', carroController.list);

router.post('/agregarProducto/:id', carroController.agregarProducto);

module.exports = router;