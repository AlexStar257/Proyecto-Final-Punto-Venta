const express = require('express');
// const myconnection = require('express-myconnection');
// const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path')
const morgan = require('morgan');

// Iniciar puerto 
const app = express();


//Cambiar extensión a archivos ejs
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);

//middlewares
app.use(morgan('dev'));

//Conexión Base de Datos

// app.use(myconnection(mysql,{
// 	host: '52.32.208.197',
// 	user: 'pepito',
// 	password: 'pepito',
// 	port: 3306,
// 	database: 'mtt'
// }));

// app.use(myconnection(mysql,{
// 	host: 'localhost',
// 	user: 'root',
// 	password: '',
// 	port: 3306,
// 	database: 'mtt'
// },'single'));

//Ocultar rutas(?
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized : true,
}))

//Importando rutas
//Relacionado al Login y la sesión
const loginRoutes = require('./routes/login');
const productosRoutes = require('./routes/productos');
const carroRoutes = require('./routes/carro');
//Rutas
app.use('/', productosRoutes);
app.use('/', carroRoutes);
app.use('/', loginRoutes);

app.get('/', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('home', {name: req.session.name});
	} else {
		res.redirect('/login');
	  }
});
app.get('/admin/home', (req, res) => {
	if (req.session.loggedin == true) {
	  res.render('admin/home', { name: req.session.name });
	} else {
	  res.redirect('/login');
	}
  });
//Comprobación de Admin o Usuario
app.get('/nosotros', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('usuarios/nosotros', {name: req.session.name});
	} else {
		res.redirect('/login');
	  }
});
app.get('/contacto', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('usuarios/contacto', {name: req.session.name});
	} else {
		res.redirect('/login');
	  }
});

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Imágenes 
app.use('/uploads', express.static('uploads'));

app.set('port', 4000);
app.listen(app.get('port'), () => {
	console.log('Iniciando en puerto: ', app.get('port'));
});

