var mongoose = require('mongoose')
var monedero = new mongoose.Schema({
    status: {
        required: true,
        type: mongoose.Schema.Types.Boolean
    },
    valor: {
        required: true,
        type: mongoose.Schema.Types.Number
    },
    reg_moneda: {
        type: Date,
        default: Date.now
    }
})
mongoose.model('monedero', monedero);
module.exports = mongoose.model('monedero');