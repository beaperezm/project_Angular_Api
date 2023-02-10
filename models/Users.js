const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'El email no tiene un formato válido']
    },
    password: { type: String, required: true, 
        // match: [/^(?=\w*\d)\S{6,}$/, 'La contraseña no tiene un formato válido (deberá de ser de más de 6 caracteres e incluir al menos un número)'] 
    },
    confirmPassword: { type: String, required: true },
    picture: String,
    role: {type: String, enum: ['admin', 'user']},
    firstName: { type: String, required: true },
    lastName: String,
    favoriteDinos: [{ type: mongoose.Types.ObjectId, ref: 'Dinosaur' }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;