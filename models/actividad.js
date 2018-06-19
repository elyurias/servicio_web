var mongoose = require('mongoose');
var ActividadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
mongoose.model('Actividad', ActividadSchema);
module.exports = mongoose.model('Actividad');