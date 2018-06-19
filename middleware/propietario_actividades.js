var Actividad = require("../models/actividad");
module.exports = (req, res, next) => {
    Actividad.findOne({ _id: req.params.id }).populate('id_usuario').where("id_usuario", req.userId).exec((err, actividad) => {      
        if (err) return res.status(200).json({ status: false, message: "Error en extraer la actividad" });
        if (!actividad) return res.status(200).json({ status: false, message: "No se encontro nada" });
        next()
    });
}