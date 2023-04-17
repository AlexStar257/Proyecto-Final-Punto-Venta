const bcrypt = require('bcrypt');

function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
    } else {
        res.redirect('/');
    }
}

function auth(req, res) {
    const data = req.body;
    // console.log(data);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                        if (!isMatch) {
                            res.status(400).send("¡Contraseña Incorrecta!");
                            return;
                        } else {
                            if (element.tipo === 'administrador') {
                                req.session.loggedin = true;
                                req.session.name = element.name;
                                res.redirect('/admin/home');
                            } else if (element.tipo === 'usuario') {
                                req.session.loggedin = true;
                                req.session.name = element.name;
                                res.redirect('/');
                            } else {
                                return res.status(400).send("Tipo de usuario desconocido");
                            }
                        }
                    });
                });
            } else {
                return res.status(400).send("¡El Usuario NO existe!");
            }
        });
    });
}

function register(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/register');
    } else {
        res.redirect('/');
    }
}

function storeUser(req, res) {
    const data = req.body;
    // console.log(data);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                return res.status(400).send("¡El Usuario YA existe!");
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;

                    data.domicilio = req.body.domicilio;
                    data.telefono = req.body.telefono;

                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO usuarios SET ?', [data], (err, rows) => {
                            req.session.loggedin = false;
                            req.session.name = data.name;
                            res.redirect('/login');
                        });
                    });
                });
            }
        });
    });

}


function logout(req, res) {
    if (req.session.loggedin == true) {
        req.session.destroy();
    }
    res.redirect('/login');
}

function listUsuarios(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios', (err, productos) => {
            if (err) {
                res.json(err); //next(err);
            }
            if (req.session.loggedin == true) {
                res.render('admin/usuarios', { name: req.session.name, data: productos, });
            } else {
                res.redirect('/login');
            }
        });
    });
};

function deleteUsuario(req, res) {
    const { email } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM usuarios WHERE email = ?', [email], (err, rows) => {
            res.redirect('/usuarios');
        })
    })
};

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
    listUsuarios,
    deleteUsuario,
}