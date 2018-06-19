var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['RegistroNormal','Google'],
        required: true
    },
    moneda: {
        type: String,
        required: true
    },
    nivelDeAcceso: {
        type: Number,
        enum:[
            1, // Usuario normal
            2, // Usuario que Registra actividades
            3
        ],
        required: true
    },
    status: {
        type: mongoose.Schema.Types.Number,
        enum: [0, 1]
    },
    reg_usuario: {
        type: Date,
        default: Date.now
    }
});
UserSchema.plugin(uniqueValidator);
mongoose.model('Usuario', UserSchema);
module.exports = mongoose.model('Usuario');