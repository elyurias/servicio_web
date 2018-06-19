var mongoose = require('mongoose');
var compra = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    cantidad: {
        type: mongoose.Schema.Types.Number
    },
    donde_se_genero: {
        type: mongoose.Schema.Types.String
    },
    clave: {
        type: mongoose.Schema.Types.String
    }
});
mongoose.model('compra_de_moneda', compra);
module.exports = mongoose.model('compra_de_moneda');