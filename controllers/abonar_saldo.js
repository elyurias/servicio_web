var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');
var TengoCredito = require('../middleware/credito');
var compraActividades = require('../models/compra_actividades');

ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var encdec = require('../middleware/mod_secure');
var config = require('../config');

var User = require('../models/user');
var Moneda = require('../models/monedero');
var mongoose = require('mongoose');

ruta.post('/', [VerifyToken, TengoCredito], (req, res) => {
    if (typeof req.body.saldo_suma == 'undefined') return res.status(200).json({ status: false, message: "Estructura incorrecta" });
    var enc = new encdec();
    User.findById(req.userId, (err, user) => {
        if (err) return res.status(200).json({ status: false, message: "Error al acceder a la informacion del usuario" });
        if (!user) return res.status(200).json({ status: false, message: "El usuario no existe" });
        var _id_moneda = enc.decrypt(config.Moneda_Secret_codificate, user.moneda);
        var _id_moneda_Object = mongoose.Types.ObjectId(_id_moneda);
        Moneda.findByIdAndUpdate(_id_moneda_Object, { status: false }, (err, moneda) => {
            if (err) return res.status(200).json({ status: false, message: "No se accedio a la moneda electronica" });
            var valor_general = parseFloat(moneda.valor) + parseFloat(req.body.saldo_suma);
            Moneda.create({
                valor: valor_general,
                status: true
            }, (err, monedaDos) => {
                if (err) return res.status(200).json({ status: false, message: "Error al obtener el recurso" });
                var moneda_codificada = enc.encrypt(config.Moneda_Secret_codificate, monedaDos._id);
                User.findByIdAndUpdate(req.userId, { moneda: moneda_codificada }, (err, usuario_cambio) => {
                    if (err || !usuario_cambio) return res.status(200).json({ status: false, message: "No se puede acceder al usuario" });
                    return res.status(200).json({ status: true, message: "Se ha abonado la cantidad correspondiente a la solicitante" });
                });
            });
        });
    });
});

module.exports = ruta;