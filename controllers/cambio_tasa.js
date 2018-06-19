var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');
ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var encdec = require('../middleware/mod_secure');
var User = require('../models/user');
var config = require('../config');

var Tasa = require('../models/tasa_cambio');
var mongoose = require('mongoose');

ruta.post('/', [VerifyToken], (req, res) => {
    //Nuevo valor req.body.NuevoValor
    if (typeof req.body.nuevoValor == 'undefined') return res.status(200).json({ status: false, message: "No tiene los parametros necesarios" });
    User.findById(req.userId, (err, user) => {
        if (user.nivelDeAcceso != 3) return res.status(200).json({ status: false, message: "No tienes los permisos suficientes" });
        Tasa.update({}, { status: false }, { multi: true }, (err, raws) => {
            if (err) return res.status(200).json({ status: false, message: "Operacion invalida", errDev: err });
            Tasa.create({ status: true, valor_pesos_MXN: req.body.nuevoValor, laUnidad: 1 }, (err, tasa) => {
                if (err) return res.status(200).json({ status: false, message: "No se genero la nueva tasa de cambio" });
                return res.status(200).json({ status: true, ultimaMonedaGenerada: tasa });
            });
        });
    });
});
ruta.get('/', (req, res) => {
    Tasa.findOne({ status: true }).limit(1).exec((err, tasa) => {
        if (err) return res.status(200).json({ status: false, message: "No se genero la tasa de cambio" });
        if (!tasa) return res.status(200).json({ status: false, message: "No se encontro una tasa de cambio aceptable" });
        return res.status(200).json({ status: true, message: "La tasa de cambio se encontro de manera satisfactoria", cuerpo: tasa, valor: tasa.valor_pesos_MXN });
    });
});
module.exports = ruta;