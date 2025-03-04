const mongoose = require('mongoose')
const { Schema } = mongoose

const chatMessageSchema = new Schema({
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }
}, {
    timestamps: { createdAt: 'createdAt' }
})

module.exports = mongoose.model('ChatMessage', chatMessageSchema)