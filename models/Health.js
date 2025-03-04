const mongoose = require('mongoose')
const { Schema } = mongoose

const healthActivityLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    steps: { type: Number },
    sleepHours: { type: Number },
    physicalActivity: { type: String }
}, {
    timestamps: { createdAt: 'createdAt' }
})

module.exports = mongoose.model('HealthActivityLog', healthActivityLogSchema)