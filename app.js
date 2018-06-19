var express = require('express');
var app = express();
var db = require('./models/db');
global.__root = __dirname + '/';

// RESTful - MEAN Stack
         //MongoDB   -> DB
       //Express   -> RESTful
         //AngularJS -> VISTA -> [Materializecss, Bootstrap] //Me estoy tardando con esta cosa... jaja
       //NodeJS    -> Servidor -> [Express]

app.get('/api', function (req, res) {
    var d = new Date()
    return res.status(200).json({
        message: 'Ok',
        type: "API para Moneda Electronica, Con Monedero",
        version: "1.0.1",
        date: d,
        codigo_fuente: "JavaScript"
    });
});

var UserController = require('./controllers/user');
app.use('/api/users', UserController);

var AuthController = require('./controllers/auth');
app.use('/api/auth', AuthController);

var ActvController = require('./controllers/actividad');
app.use('/api/activity', ActvController);

var TranController = require('./controllers/transacciones');
app.use('/api/transaccion', TranController);

var PagoController = require('./controllers/pago_actividad');
app.use('/api/pago_venta', PagoController);

var TasaController = require('./controllers/cambio_tasa');
app.use('/api/tasa_cambio', TasaController);

var AbonController = require('./controllers/abonar_saldo');
app.use('/api/abonar_saldo', AbonController);

module.exports = app;