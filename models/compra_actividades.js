var mongoose = require("mongoose");
var compraAct = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    id_actividad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actividad'
    },
    reg_compra: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('compra_actividad', compraAct);
module.exports = mongoose.model('compra_actividad');