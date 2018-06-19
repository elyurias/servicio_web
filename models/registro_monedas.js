var mongoose = require('mongoose');
var regMoneda = new mongooose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    id_moneda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'monedero'
    }
});
mongoose.model('reg_moneda', regMoneda);
module.exports = mongoose.model('reg_moneda')