const controller = {};
const pool = require('../bd.js');
function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/carro');
    }
}

controller.list = (req,res) =>{
    pool.getConnection((err,conn)=>{
        conn.query('SELECT * FROM productos', (err, productos)=>{
            if(err){
                res.json(err);
            }
            if (req.session.loggedin == true) {
                res.render('usuarios/carro', {name: req.session.name, data: productos,});
            } else {
                res.redirect('/login');
            }
        });
    });
};

controller.listShopping = (req,res) =>{
  pool.getConnection((err,conn)=>{
      conn.query('SELECT * FROM productos', (err, productos)=>{
          if(err){
              res.json(err); //next(err);
          }
          if (req.session.loggedin == true) {
            res.render('usuarios/shopping', {name: req.session.name, data: productos,});
        } else {
            res.redirect('/login');
        }
      });
  });
};

// Agregar producto al carrito
controller.agregarProducto = (req, res) => {
  const { producto_id, cantidad } = req.body;
  const usuario_email = req.session.name; 
  pool.getConnection((err, conn) => {
    conn.query('INSERT INTO carrito_compras (producto_id, cantidad, usuario_email) VALUES (?, ?, ?)', [producto_id, cantidad, usuario_email], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
      }

      res.redirect('/carro'); 
    });
  });
};
module.exports = controller;