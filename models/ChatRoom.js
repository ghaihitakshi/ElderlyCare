const mongoose = require('mongoose')
const { Schema } = mongoose

const chatRoomSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    name: { type: String },
    isGroupChat: { type: Boolean, default: false },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'ChatMessage' },
    messages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
})

module.exports = mongoose.model('ChatRoom', chatRoomSchema) 