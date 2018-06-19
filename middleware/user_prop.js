var user = require('../models/user')
module.exports = (req, res, next) => {
    user.findOne({
        _id: req.userId
    })
        .where('nivelDeAcceso').equals(2)
        .exec((err, user) => {
            if (err) return res.status(200).send({ status: false, message: 'Error: Faltal Error' });
            if (!user) return res.status(200).send({ status: false, message: "No tienes los permisos para registrar o modificar actividades" });
            next();
    });
}