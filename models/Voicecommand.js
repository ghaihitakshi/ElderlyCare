const mongoose = require('mongoose')
const { Schema } = mongoose

const voiceCommandSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commandText: { type: String, required: true }
}, {
    timestamps: { createdAt: 'createdAt' }
})

module.exports = mongoose.model('VoiceCommand', voiceCommandSchema)