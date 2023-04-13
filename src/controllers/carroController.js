const controller = {};

function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/carro');
    }
}

controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM productos', (err, productos) => {
      if (err) {
        res.json(err); //next(err);
      }
      res.render('usuarios/carro', { data: productos });
    });
  });
};
