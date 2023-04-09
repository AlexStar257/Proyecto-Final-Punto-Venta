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
            res.render('productos',{
                data: productos,
            });
        });
    });
};

controller.save = (req,res)=>{
    const data = req.body;
    req.getConnection((err,conn)=>{
        conn.query('INSERT INTO productos set ?',[data], (err,producto)=>{
            console.log(producto);
            res.send('worksssss');
        });
    });
};

module.exports = controller;