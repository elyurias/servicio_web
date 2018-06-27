var Monedero = require('../models/monedero');
var encdec = require('../middleware/mod_secure');
var User = require('../models/user');
var config = require('../config');
var mongoose = require('mongoose');
module.exports = (req, res, next) => {
    User.findById(req.userId, (err, user) => {
        if (err) return res.status(200).json({ status: false, message: "Error del servidor" });
        if (!user) return res.status(200).json({ status: false, message: "No se pudo obtener el usuario" });
        var dec = new encdec()
        try {
            var data = dec.decrypt(config.Moneda_Secret_codificate, user.moneda);
            var _id_moneda = mongoose.Types.ObjectId(data);
            console.log(_id_moneda);
            Monedero.findById(_id_moneda).where("status", true).limit(1).exec((err, moneda) => {
                if (err) return res.status(200).json({ status: false, message: "Error al obtener la moneda" });
                if (!moneda) return res.status(200).json({ status: false, message: "No tienes ninguna moneda en el sistema" });
                req.userValor = moneda.valor;
                req.monedaId = _id_moneda;
                next();
            });
        } catch (e) {
            return res.status(200).json({ status: false, message: "Error al Codificar la moneda" });
        }
    });
}