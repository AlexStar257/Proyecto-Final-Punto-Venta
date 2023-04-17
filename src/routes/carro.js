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
router.get('/shopping', carroController.listShopping);
router.get('/getProductos',(req,res)=>{
  req.getConnection((err,conn)=>{
    conn.query('SELECT * FROM productos', (err, productos)=>{
        if(err){
            res.json(err); //next(err);
        }
        res.json(productos);
})
  })
})
router.post('/agregarProducto/:id', carroController.agregarProducto);

module.exports = router;