var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');
var TengoCredito = require('../middleware/credito');
var Transaccion = require('../models/transaccion');
var compraActividades = require('../models/compra_actividades');
ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var Actividad = require('../models/actividad');
var encdec = require('../middleware/mod_secure');
var User = require('../models/user');
var config = require('../config');

var Moneda = require('../models/monedero');
var mongoose = require('mongoose');

ruta.post('/', [VerifyToken, TengoCredito], (req, res) => {
    var id_actividad = req.body.actividadId;
    console.log(id_actividad)
    Actividad.findById(id_actividad, (err, actividad) => {
        console.log(actividad);
        if (err || !actividad) return res.status(200).json({ status: false, message: "No se pudo obtener la actividad" });
        if (req.userValor < actividad.costo) return res.status(200).json({ status: false, message: "No tienes el suficiente credito para pagar el articulo" });
        var id_usuario = actividad.id_usuario;
        var enc = new encdec();
        User.findById(req.userId, (err, user) => {
            if (err) return res.status(200).json({ status: false, message: "Error al acceder a la informacion del usuario" });
            if (!user) return res.status(200).json({ status: false, message: "El usuario no existe" });
            var _id_moneda = enc.decrypt(config.Moneda_Secret_codificate, user.moneda);
            var _id_moneda_Object = mongoose.Types.ObjectId(_id_moneda);
            console.log("Moneda a destruir Paga");
            console.log(_id_moneda_Object);
            Moneda.findByIdAndUpdate(_id_moneda_Object, { status: false }, (err, moneda) => {
                if (err) return res.status(200).json({ status: false, message: "No se accedio a la moneda electronica" });
                var valor_general = parseFloat(moneda.valor) - parseFloat(actividad.costo)
                Moneda.create({
                    valor: valor_general,
                    status: true
                }, (err, monedaDos) => {
                    if (err) return res.status(200).json({ status: false, message: "Error al obtener el recurso" });
                    var moneda_codificada = enc.encrypt(config.Moneda_Secret_codificate, monedaDos._id);
                    User.findByIdAndUpdate(req.userId, { moneda: moneda_codificada }, (err, usuario_cambio) => {
                        console.log(usuario_cambio);
                        if (err || !usuario_cambio) return res.status(200).json({ status: false, message: "No se puede acceder al usuario" });
                        //return res.status(200).json({ status: true, data: usuario_cambio });
                    });
                });
            });
        });
        console.log("-----------------------------------");
        User.findById(actividad.id_usuario, (err, superUser) => {
            var _id_moneda = enc.decrypt(config.Moneda_Secret_codificate, superUser.moneda);
            var _id_moneda_Object = mongoose.Types.ObjectId(_id_moneda);
            Moneda.findByIdAndUpdate(_id_moneda_Object,
                {
                    status: false
                }, (err, monedaUpd) => {
                console.log("Moneda a destruir Cobra");
                console.log(monedaUpd._id);
                if (err) return res.status(200).json({ status: false, message: "La transferencia no puede ser realizada" });
                Moneda.create({     //Aqui es donde explota todo
                    valor: parseFloat(monedaUpd.valor) + parseFloat(actividad.costo),
                    status: true
                }, (err, monedaDos) => {
                    if (err) return res.status(200).json({ status: false, message: "No se pudo hacer la transferencia" });
                    User.findByIdAndUpdate(actividad.id_usuario, {
                        moneda: enc.encrypt(config.Moneda_Secret_codificate, monedaDos._id + "")
                    }, (err, usuario) => {
                        console.log(usuario);
                        if (err) return res.status(200).json({ status: false, message: "Error al asignar el usuario al sistema" });
                        if (!usuario) return res.status(200).json({ status: false, message: "Error al encontrar al usuario" });
                    });
                });
            });
        });
        compraActividades.create({
            id_usuario: req.userId,
            id_actividad: actividad._id
        }, (err, reg_actividad) => {
        });
        return res.status(200).json({ status: true, message: "Haz comprado el articulo", cuerpo: actividad });
    });
});
module.exports = ruta;