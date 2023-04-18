const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../bd.js');
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
  pool.getConnection((err,conn)=>{
    conn.query('SELECT * FROM productos', (err, productos)=>{
        if(err){
            res.json(err); //next(err);
        }
        res.json(productos);
})
  })
})

router.post('/comprar',(req,res)=>{
  let {carrito,metodo} = req.body;
  try {
    carrito = JSON.parse(carrito)
  } catch (error) {
    return res.status(400).send("Carrito inválido :V")
  }
  let total = 0;
  console.log(carrito)
		for (const [key, value] of Object.entries(carrito)) {
			total += value.precio * value.cantidad;

		}
  pool.getConnection((err,conn)=>{
    conn.query('INSERT INTO ventas (total, metodoPago, id_email) VALUES (?, ?, ?)', [total, metodo, req.session.email])
})
})


router.post('/agregarProducto/:id', carroController.agregarProducto);

module.exports = router;