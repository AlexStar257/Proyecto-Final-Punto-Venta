const express = require('express');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path')
const morgan = require('morgan');

//Importando rutas
const productosRoutes = require('./routes/productos');

// Iniciar puerto 
const app = express();
app.set('port', 4000);
app.listen(app.get('port'), () => {
	console.log('Iniciando en puerto: ', app.get('port'));
});


//Cambiar extensión a archivos ejs
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);


//middlewares
app.use(morgan('dev'));


//Conexión Base de Datos
app.use(myconnection(mysql,{
	host: 'localhost',
	user: 'root',
	password: '',
	port: 3306,
	database: 'mtt'
},'single'));


//Ocultar rutas(?
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


//Relacionado al Login y la sesión
const loginRoutes = require('./routes/login');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized : true,
}))

//Rutas
app.get('/', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('home', {name: req.session.name});
    } else {
        res.redirect('/login');
    }
});

app.get('/', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('admin/productos', {name: req.session.name});
    } else {
        res.redirect('/login');
    }
});

app.get('/nosotros', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('usuarios/nosotros', {name: req.session.name});
    } else {
        res.redirect('/login');
    }
});

app.use('/', productosRoutes);

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRoutes);


