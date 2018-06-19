var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');

ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var User = require('../models/user');

var VerifyToken = require('../controllers/token');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var moneda = require('../middleware/middleware_monedero');
var Monedero = require('../models/monedero');
var encrypt = require('../middleware/mod_secure');
var TengoCredito = require('../middleware/credito');

ruta.post('/login', function (req, res) {
    if (typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined') return res.status(200).json({ status: false, message: "No tiene los parametros necesarios" });
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(200).send({ auth:false, message: 'Error del Servidor' });
        if (!user) return res.status(200).send({ auth: false, message: 'No se encuentra registrado' });
        if (user.tipo == 'Google') {
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 604800
            });
            return res.status(200).send({ auth: true, token: token, message: "Bienvenido", tipo: user.nivelDeAcceso });
        }
        var passwordEsValido = bcrypt.compareSync(req.body.password, user.password);
        //var passwordEsValido = req.body.password == user.password ? true : false;
        if (!passwordEsValido) return res.status(200).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 604800
        });
        return res.status(200).send({ auth: true, token: token, message: "Bienvenido", tipo: user.nivelDeAcceso });
    });
});

ruta.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

ruta.post('/registrar', function (req, res) {
    if (typeof req.body.email == 'undefined' ||
        typeof req.body.password == 'undefined' ||
        typeof req.body.tipo_sesion == 'undefined' ||
        typeof req.body.na == 'undefined') return res.status(200).json({ status: false, message: "No tiene los parametros necesarios" });
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    //Servidor en modo de pruebas.
    // --return res.status(200).json(req.body);
    var enc = new encrypt()
    Monedero.create({
        status: true,
        valor: 0.0
    }, (err, monedero) => {
        if (err) return res.status(200).json({ auth: false, message: "Error: no se puede crear la moneda electronica" });
        if (!monedero) return res.status(200).json({ auth: false, message: "Sin moneda generada, intenta registrarte nuevamente" });
        req.monedaId = enc.encrypt(config.Moneda_Secret_codificate, monedero._id + "");
        User.create(
            {
                email: (req.body.email).toLowerCase(),
                password: hashedPassword,
                //password: req.body.password,
                moneda: req.monedaId,//Codificar moneda en esta area
                tipo: req.body.tipo_sesion,
                nivelDeAcceso: req.body.na,
                status: 1
            }
            , function (err, User) {
                if (err) {
                    Monedero.findByIdAndRemove(monedero._id, (err, moneda) => {
                    });
                    return res.status(200).send({ auth: false, message: 'No se Puede Registrar', descError: err });
                }
                var token = jwt.sign(
                    { id: User._id }, config.secret, {
                        expiresIn: 86400 //24 Horas e.e
                    });
                return res.status(200).send({
                    auth: true, token: token, fecha_registro: User.reg_usuario
                });
            }
        );
    });
});
ruta.get('/perfil', VerifyToken, function (req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(200).send({ status:false, message: 'No se encuentran datos' });
        if (!user) return res.status(200).send({ status:false, message: 'No estas registrado' });
        return res.status(200).send(user);
    });
});

ruta.get('/micredito', [VerifyToken, TengoCredito], (req, res) => {
    return res.status(200).json({
        status: true,
        id_usuario: req.userId,
        cantidad_moneda: req.userValor
    });
});

module.exports = ruta;