var express = require('express');
var ruta = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('../controllers/token');

ruta.use(bodyParser.json());
ruta.use(bodyParser.urlencoded({ extended: true }));

var Actividad = require('../models/actividad');
var mmlActividad = require('../middleware/user_prop');
var propiedad = require("../middleware/propietario_actividades");
//Registrar actividad
//ruta.all("/*", mmlActividad)

ruta.post('/', [VerifyToken, mmlActividad], (req, res) => {
    Actividad.create({
        id_usuario:     req.userId,
        name:           req.body.name,
        descripcion:    req.body.descripcion,
        costo:          req.body.costo
    },
        (err, Actividad) => {
            if (err) return res.send({ status: false, message: "No se puede registrar la actividad" });
            res.send({ status: true, message: "Se ha registrado la actividad", id_actividad: Actividad._id });
        });
});
ruta.delete('/:id', [VerifyToken, mmlActividad, propiedad], (req, res) => {
    Actividad.findByIdAndRemove(req.params.id, (err, actividad) => {
        if (err) return res.status(200).json({ status: false, message: "No se puede eliminar la actividad" });
        if (!actividad) return res.status(200).json({ status: false, message: "No se encuentra la actividad" });
        res.status(200).json({status: true, message:"Se ha eliminado la actividad"});
    });
});
ruta.put('/:id', [VerifyToken, mmlActividad, propiedad], (req, res) => {
    Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, actividad) => {
        if (err) return res.status(200).json({ status: false, message: "Ocurrio un error al actualizar el registro" });
        if (!actividad) return res.status(200).json({ status: false, message: "No se encontro la actividad" });
        return res.status(200).json({ status: true, message:"Se actualizo la actividad", documento:actividad });
    });
});
ruta.get('/:id',(req, res) => {
    Actividad.findById(req.params.id, (err, actividad) => {
        if (err) return res.status(200).json({ status: false, message: "Ocurrio un error, intentelo mas tarde" });
        if (!actividad) return res.status(200).json({ status: false, message: "No se encontro la actividad" }); 
        return res.status(200).json(actividad);
    });
});
ruta.get('/', (req, res) => {
    Actividad.find({}, (err, actividad) => {
        if (err) return res.status(200).json({ status: false, message: "Ocurrio un error, intentelo mas tarde" });
        if (!actividad) return res.status(200).json({ status: false, message: "No se encontro la actividad" });
        return res.status(200).json(actividad);
    });
});
module.exports = ruta;