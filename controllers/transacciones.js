var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');

ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var Transaccion = require('../models/transaccion');
var TengoCredito = require('../middleware/credito');

var encdec = require('../middleware/mod_secure');
var User = require('../models/user');
var config = require('../config');

var Moneda = require('../models/monedero');
var mongoose = require('mongoose');
ruta.get('/', (req, res) => {
    Transaccion.find({}, (err, transaccion) => {
        if (err) return res.status(200).json({ status: false, message: "Error al recuperar todas las transacciones existentes dentro de el universo FestCoin" });
        if (!transaccion) return res.status(200).json({ status: false, message: "Sin registros, la base de datos esta limpia" });
        return res.status(200).json({status:true, datos:transaccion});
    });
});
ruta.get('/:id', (req, res) => {
    Transaccion.findById(req.params.id, (err, transaccion) => {
        if (err || !transaccion) return res.status(200).json({ status: false, message: "No se puede acceder al recurso" });
        return res.status(200).json({ status: true, data: transaccion });
    });
});
ruta.post('/', [VerifyToken, TengoCredito], (req, res) => {
    console.log(req.body.cantidad); 
    console.log("Lo que quieres transferir " + parseInt(req.body.cantidad) + ", tuSaldo " + parseInt(req.userValor));
    if (parseFloat(req.body.cantidad) > parseFloat(req.userValor))
        return res.status(200).json({ status: false, message: "No cuentas con el credito suficiente" });
    Transaccion.create(
        {
            medio: req.body.medio_de_creacion,
            envio: req.userId,
            cantidad: req.body.cantidad,
            estado: false
        },
        (err, transaccion) => {
            if (err) return res.status(200).json({ status: false, message: "No se pudo generar la transaccion A/B" });
            if (!transaccion) return res.status(200).json({ status: false, message: "No se genero la transaccion B/B" });
            var enc = new encdec();
            var moneda_encriptada = enc.encrypt(config.Moneda_Secret_codificate, parseFloat(req.body.cantidad).toString());
            console.log("La moneda encriptada es: " + moneda_encriptada)
            console.log("La moneda original   es: " + enc.decrypt(config.Moneda_Secret_codificate, moneda_encriptada))
            return res.status(200).json({ status: true, cuerpo: transaccion, moneda_encriptada: moneda_encriptada });
        }
    );
});
ruta.post('/finalizar/:id', [VerifyToken, TengoCredito], (req, res) => {
    /* Cosas que existen en el sistema
        req.userId
        req.userValor
        req.monedaId */
    console.log("---------Iniciando_Transaccion---------------------------------------------");
    var enc = new encdec();
    var identificador = (req.params.id).toString().split("__::__")
    console.log(identificador)
    if (typeof identificador != 'object') {
        return res.status(200).json({ status: false, message: "Error al acceder al recurso" })
    }
    var moneda = 0.0
    try {
        moneda = enc.decrypt(config.Moneda_Secret_codificate, identificador[1]);
        console.log("Moneda asociada a la transaccion: "+moneda)
    } catch (e) {
        return res.status(200).json({ status:false, message:"Error al obtener la moneda"})
    }
    console.log(identificador[0])
    Transaccion.findByIdAndUpdate(identificador[0], {
        estado: true,
        recibio: req.userId
    },{ "new": true }).where('estado', false).exec((err, transaccion) => {
        if (err) return res.status(200).json({ status: false, message: "Error al acceder al recurso" });
        if (!transaccion) return res.status(200).json({ status: false, message: "No se encontro el recurso" });
        //Todo esto se deberia hacer de una forma mas facil...
        User.findById(transaccion.envio, (err, user) => {
            if (err) return res.status(200).json({status: false, message:"Error al acceder a la informacion del usuario"});
            if (!user) return res.status(200).json({ status: false, message: "El usuario no existe" });
            var _id_moneda = enc.decrypt(config.Moneda_Secret_codificate, user.moneda);
            var _id_moneda_Object = mongoose.Types.ObjectId(_id_moneda);
            Moneda.findByIdAndUpdate(_id_moneda_Object, {status:false}, (err, moneda) => {
                if (err) return res.status(200).json({ status: false, message: "No se accedio a la moneda electronica" });
                var valor_general = parseFloat(moneda.valor) - parseFloat(transaccion.cantidad);
                Moneda.create({
                    valor: valor_general,
                    status: true
                }, (err, monedaDos) => {
                    if (err) return res.status(200).json({ status: false, message: "Error al obtener el recurso" });
                    var moneda_codificada = enc.encrypt(config.Moneda_Secret_codificate, monedaDos._id + "");
                    User.findByIdAndUpdate(transaccion.envio, { moneda: moneda_codificada }, (err, usuario_cambio) => {
                        if (err || !usuario_cambio) return res.status(200).json({ status: false, message: "No se puede acceder al usuario" });
                    });
                });
            });
        });
        Moneda.create({
            valor: parseFloat(req.userValor) + parseFloat(transaccion.cantidad),
            status: true
        }, (err, monedaDos) => {
            if (err) return res.status(200).json({ status: false, message: "No se pudo hacer la transferencia" });
            Moneda.findByIdAndUpdate(req.monedaId, {
                status: false
            }, (err, monedaUpd) => {
                console.log("La moneda del usuario a transferir")
                console.log(monedaDos)
                if (err) return res.status(200).json({ status: false, message: "La transferencia no puede ser realizada" });
                User.findByIdAndUpdate(req.userId, {
                    moneda: enc.encrypt(config.Moneda_Secret_codificate, monedaDos._id + "")
                }, (err, usuario) => {
                    if (err) return res.status(200).json({ status: false, message: "Error al asignar el usuario al sistema" });
                });
            });
            });
        console.log("La transaccion ha sido finalizada")
        return res.status(200).json({ status: true, message:"Transaccion correcta", cuerpo: transaccion });
    });
});
module.exports = ruta;