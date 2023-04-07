const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

// Iniciar puerto 
const app = express();
app.set('port', 4000);
app.listen(app.get('port'), () => {
	console.log('Iniciando en puerto: ', app.get('port'));
});

//Conexión Base de Datos
app.use(myconnection(mysql,{
	host: 'localhost',
	user: 'root',
	password: '',
	port: 3306,
	database: 'mtt'
}));

//Cambiar extensión a archivos hbs
app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
	extname: '.hbs',
}));
app.set('view engine', 'hbs');

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

app.get('/', (req,res) => {
	if (req.session.loggedin == true) {
        res.render('home', {name: req.session.name});
    } else {
        res.redirect('/login');
    }
});

app.use('/', loginRoutes);

