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

router.get('/carro', carroController.list); // aquí asignamos la función "list" a la ruta "/carro"


router.post('/agregarProducto/:id', carroController.agregarProducto);







// router.get('/carro', carroController.list);
// router.post('/add', upload.single('urlImagen'),carroController.save);
// router.get('/delete/:id', carroController.delete);
// router.get('/update/:id', carroController.edit);
// router.post('/update/:id', carroController.update);
// router.get('/buscar', carroController.buscar);
// router.get('/estado/:id', carroController.estado);
// router.post('/add', (req, res, next) => {
//     upload.single('urlImagen')(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         res.status(400).json({ message: 'Error al subir el archivo' });
//       } else if (err) {
//         res.status(500).json({ message: 'Error interno del servidor' });
//       } else {
//         next();
//       }
//     });
//   }, carroController.save);
  

module.exports = router;