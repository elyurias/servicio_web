var mongoose = require("mongoose")
var transacciones = new mongoose.Schema({
    fecha_de_registro: {
        type: Date,
        default: Date.now
    },
    medio: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    envio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    recibio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    cantidad: {
        type: mongoose.Schema.Types.String,
        require: true
    },
    estado: {
        type: mongoose.Schema.Types.Boolean,
        enum: [false,true], // 0-> Registrado 1-> Registrado y finalizado
        required: true
    }
})
mongoose.model("transacciones", transacciones)
module.exports = mongoose.model('transacciones');