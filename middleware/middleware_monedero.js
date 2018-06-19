var Monedero = require('../models/monedero');
var encrypt = require('../middleware/mod_secure');
var config = require('../config');
module.exports = (req, res, next) => {
    var enc = new encrypt()
    Monedero.create({
        status: true,
        valor: 0.0
    }, (err, monedero) => {
        if (err) return res.status(200).json({ status: false, message: "Error: no se puede crear la moneda electronica" });
        if (!monedero) return res.status(200).json({ status: false, message: "Sin moneda generada, intenta nuevamente" });
        req.monedaId = enc.encrypt(req.body.password, monedero._id+"");
        next();
    })
}