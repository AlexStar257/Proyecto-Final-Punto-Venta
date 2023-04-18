const controller = {};
const pool = require('../bd.js');
function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/productos');
    }
}

controller.list = (req,res) =>{
    pool.getConnection((err,conn)=>{
        conn.query('SELECT * FROM productos', (err, productos)=>{
            if(err){
                res.json(err); //next(err);
            }
            //console.log(productos);
            if (req.session.loggedin == true) {
              res.render('admin/productos', {name: req.session.name, data: productos,});
          } else {
              res.redirect('/login');
          }
        });
    });
};

controller.save = (req, res) => {
  const data = req.body;

  // Verificar si los campos requeridos no están vacíos
  if (!data.nombre || !data.descripcion || !data.precio || !req.file) {
      res.status(400).json({ message: 'Los campos nombre, descripción, precio y url de imagen son requeridos' });
      return;
  }

  // Obtener el nombre del archivo subido
  const urlImagen = req.file.filename;

data.urlImagen = urlImagen;

  pool.getConnection((err, conn) => {
      conn.query('INSERT INTO productos SET ?', [data], (err, productos) => {
          if (err) {
              console.log(err);
              res.status(500).json({ message: 'Error interno del servidor' });
              return;
          }

          res.redirect('/productos');
      });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const nuevoProducto = req.body;

  pool.getConnection((err, conn) => {
    if (req.file) {
      // si se cargó una imagen, actualizar la imagen del producto
      nuevoProducto.urlImagen = req.file.filename;
    }
    conn.query('UPDATE productos set ? WHERE id = ?', [nuevoProducto, id], (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/productos');
    });
  });
};

// controller.update = (req,res)=>{
//     const {id} = req.params;
//     const nuevoProducto = req.body;
//     pool.getConnection((err,conn)=>{
//         conn.query('UPDATE productos set ? WHERE id = ?',[nuevoProducto, id], (err,rows)=>{
//             res.redirect('/productos');
//         });
//         });
// };

controller.delete = (req,res)=>{
    const {id} = req.params;
    pool.getConnection((err,conn)=>{
        conn.query('DELETE FROM productos WHERE id = ?',[id], (err, rows)=>{
            res.redirect('/productos');
        })
    })
};

controller.edit = (req,res)=>{
    const {id} = req.params;
    pool.getConnection((err,conn)=>{
        conn.query('SELECT * FROM productos WHERE id = ?',[id], (err,productos)=>{
          if (req.session.loggedin == true) {
            res.render('admin/editarProductos', {name: req.session.name, data: productos[0],});
        } else {
            res.redirect('/login');
        }
      });
    });
};



controller.buscar = (req, res) => {
    const { q } = req.query;
    pool.getConnection((err, conn) => {
      conn.query(
        'SELECT * FROM productos WHERE id LIKE ?',
        [`%${q}%`],
        (err, productos) => {
          if (err) {
            res.json(err);
          }
          res.render('admin/productos', {
            data: productos,
          });
        }
      );
    });
  };

  controller.estado = (req, res) => {
    const { id } = req.params;
  
    pool.getConnection((err, conn) => {
      conn.query('SELECT estado FROM productos WHERE id = ?', [id], (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Error interno del servidor' });
          return;
        }
  
        if (rows.length === 0) {
          res.status(404).json({ message: 'Producto no encontrado' });
          return;
        }
  
        const estadoActual = rows[0].estado;
  
        let nuevoEstado;
        if (estadoActual === 'activado') {
          nuevoEstado = 'desactivado';
        } else {
          nuevoEstado = 'activado';
        }
  
        conn.query('UPDATE productos SET estado = ? WHERE id = ?', [nuevoEstado, id], (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: 'Error interno del servidor' });
            return;
          }
  
          res.redirect('/productos');
        });
      });
    });
  };


//Carrito de Compras 

controller.agregarProducto = (req, res) => {
  const {id} = req.params;
  pool.getConnection((err,conn)=>{
      conn.query('SELECT * FROM productos WHERE id = ?',[id], (err,productos)=>{
          res.render('usuarios/shopping',{
          data: productos[0]
      });
      });
  });
};

module.exports = controller;