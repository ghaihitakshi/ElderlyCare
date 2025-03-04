const mongoose = require('mongoose')
const { Schema } = mongoose

const emergencyAlertSchema = new Schema({
    triggeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    message: { type: String },
    acknowledged: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: 'createdAt' } // Only createdAt is required here.
})

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema)