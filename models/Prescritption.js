const mongoose = require('mongoose')
const { Schema } = mongoose

const prescriptionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    notes: { type: String }
}, {
    timestamps: true
})

module.exports = mongoose.model('Prescription', prescriptionSchema)