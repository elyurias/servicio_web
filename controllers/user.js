var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');

ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/user');
//Registrar nuevo Usuario
ruta.post('/', function (req, res) {
    return res.status(200).json({status:false, message:"El modulo no esta activo"});
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        moneda: 0,//Preguntarle a Azamar
        tipo: req.body.tipo_sesion,
        nivelDeAcceso: req.body.na
    }, function (err, User) {
        if (err) return res.status(200).send({message:'Error al registrar al usuario'});
        res.status(200).send(User);  
    });
});
//Obtener todos los usuarios
ruta.get('/', function (req, res) {
    User.find({}, function (err, Users) {
        if (err) return res.status(200).send({ message: 'Existe algun error al obtener a todos los usuarios' });
        res.status(200).send(Users);
    });
});
//Obtener un usuario en especifico
ruta.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(200).send({ message: 'Error al buscar el usuario' });
        if (!user) return res.status(200).send({ message: 'Sin resutados' });
        res.status(200).send(user);
    });
});
//Eliminar el usuario
ruta.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(200).send({ message: 'Error al eliminar el usuario' });
        res.status(200).send({ message: 'Usuario Eliminado' });
    });
});
//actualizar el usuario
ruta.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(200).send({ message: 'Error al actualizar el usuario' });
        res.status(200).send(user);
    });
});
module.exports = ruta;