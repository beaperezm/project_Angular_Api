const mongoose = require('mongoose');

const yourDinoSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    nameMeaning: { type: String, required: true },
    type: { 
        type: [String], 
        enum: {
        values: ["Herbívoro", "Carnívoro", "Omnívoro"],
        message: "Este no es un tipo válido."
               },
        lowercase: true
            },
    weight: { type: String, required: true },
    length: { type: String, required: true },
    height: { type: String, required: true },
    picture: { type: String },
    characteristics: { type: String, required: true },
}, {
    timestamps: true
}
);

const yourDino = mongoose.model('YourDinosaur', yourDinoSchema);

module.exports = yourDino;