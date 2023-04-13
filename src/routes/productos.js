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

const productosController = require('../controllers/productosController');

router.get('/productos', productosController.list);
// router.post('/add', upload.single('urlImagen'),productosController.save);
router.get('/delete/:id', productosController.delete);
router.get('/update/:id', productosController.edit);
// router.post('/update/:id', productosController.update);
router.get('/buscar', productosController.buscar);
router.get('/estado/:id', productosController.estado);

router.post('/add', (req, res, next) => {
    upload.single('urlImagen')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400).json({ message: 'Error al subir el archivo' });
      } else if (err) {
        res.status(500).json({ message: 'Error interno del servidor' });
      } else {
        next();
      }
    });
  }, productosController.save);
  
  router.post('/productos/:id/update', upload.single('imagen'), productosController.update);

module.exports = router;