const controller = {};

function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/productos');
    }
}

controller.list = (req,res) =>{
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM productos', (err, productos)=>{
            if(err){
                res.json(err); //next(err);
            }
            console.log(productos);
            res.render('admin/productos',{
                data: productos,
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
  
    // Verificar si los campos requeridos no están vacíos
    if (!data.nombre || !data.descripcion || !data.precio || !data.urlImagen) {
      res.status(400).json({ message: 'Los campos nombre, descripción, precio y url de imagen son requeridos' });
      return;
    }
  
    req.getConnection((err, conn) => {
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
  

controller.delete = (req,res)=>{
    const {id} = req.params;
    req.getConnection((err,conn)=>{
        conn.query('DELETE FROM productos WHERE id = ?',[id], (err, rows)=>{
            res.redirect('/productos');
        })
    })
};

controller.edit = (req,res)=>{
    const {id} = req.params;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM productos WHERE id = ?',[id], (err,productos)=>{
            res.render('admin/editarProductos',{
            data: productos[0]
        });
        });
    });
};

controller.update = (req,res)=>{
    const {id} = req.params;
    const nuevoProducto = req.body;
    req.getConnection((err,conn)=>{
        conn.query('UPDATE productos set ? WHERE id = ?',[nuevoProducto, id], (err,rows)=>{
            res.redirect('/productos');
        });
        });
};

controller.buscar = (req, res) => {
    const { q } = req.query;
    req.getConnection((err, conn) => {
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
  
    req.getConnection((err, conn) => {
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
  
  

module.exports = controller;