var jwt = require('jsonwebtoken');
var config = require('../config');
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(200).send({ status: false, message: 'No se encuentra el usuario' });
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(200).send({ status: false, message: 'Autentificacion fallida' });
        req.userId = decoded.id;
        next();
    });
}
module.exports = verifyToken;