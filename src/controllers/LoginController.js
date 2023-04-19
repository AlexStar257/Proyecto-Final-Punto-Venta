const bcrypt = require('bcrypt');
const pool = require('../bd.js');
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
    pool.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
        if (!userdata) {
            return res.status(400).send("Usuario no encontrado");
        }
        if (userdata.length > 0) {
            userdata.forEach(element => {
                bcrypt.compare(data.password, element.password, (err, isMatch) => {
                    if (!isMatch) {
                        res.status(400).send("¡Contraseña Incorrecta!");
                        return;
                    } else {
                        if (element.tipo === 'administrador') {
                            req.session.loggedin = true;
                            req.session.email = element.email;
                            req.session.name = element.name;
                            res.redirect('/admin/home');
                        } else if (element.tipo === 'usuario') {
                            req.session.loggedin = true;
                            req.session.email = element.email;
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

    pool.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
        if (userdata.length > 0) {
            return res.status(400).send("¡El Usuario YA existe!");
        } else {
            bcrypt.hash(data.password, 12).then(hash => {
                data.password = hash;

                data.domicilio = req.body.domicilio;
                data.telefono = req.body.telefono;


                pool.query('INSERT INTO usuarios SET ?', [data], (err, rows) => {
                    req.session.loggedin = false;
                    req.session.name = data.name;
                    res.redirect('/login');
                });
            });
        };
    }
    )
}

function logout(req, res) {
    if (req.session.loggedin == true) {
        req.session.destroy();
    }
    res.redirect('/login');
}

function listUsuarios(req, res) {

    pool.query('SELECT * FROM usuarios', (err, productos) => {
        if (err) {
            res.json(err); //next(err);
        }
        if (req.session.loggedin == true) {
            res.render('admin/usuarios', { name: req.session.name, data: productos, });
        } else {
            res.redirect('/login');
        }
    });
};

function listVentas(req, res) {

    pool.query('SELECT * FROM ventas', (err, productos) => {
        if (err) {
            res.json(err); //next(err);
        }
        if (req.session.loggedin == true) {
            res.render('admin/registros', { name: req.session.name, data: productos, });
        } else {
            res.redirect('/login');
        }
    });
};

function deleteUsuario(req, res) {
    const { email } = req.params;

    pool.query('DELETE FROM usuarios WHERE email = ?', [email], (err, rows) => {
        res.redirect('/usuarios');
    })
}

function deleteVenta(req, res) {
    const { id } = req.params;

    pool.query('DELETE FROM ventas WHERE id = ?', [id], (err, rows) => {
        res.redirect('/registros');
    })
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
    listUsuarios,
    deleteUsuario,
    listVentas,
    deleteVenta,
}