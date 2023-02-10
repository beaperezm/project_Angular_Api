const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
    id: Number,
    period: { type: String, required: true },
    stage: { type: String, required: true },
    description: { type: String, required: true },
    dinosaurs: [{ type: mongoose.Types.ObjectId, ref: 'Dinosaur' }]
}, {
    timestamps: true
});

const Period = mongoose.model('HistoricalPeriod', periodSchema)


module.exports = Period;