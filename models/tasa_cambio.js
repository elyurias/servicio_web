var mongoose = require('mongoose');
var tasa = new mongoose.Schema({
    valor_pesos_MXN: {
        type: mongoose.Schema.Types.Number
    },
    status: {
        type: mongoose.Schema.Types.Boolean
    },
    laUnidad: {
        type: mongoose.Schema.Types.Number
    }
});
mongoose.model('tasa', tasa);
module.exports = mongoose.model('tasa');