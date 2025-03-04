const mongoose = require('mongoose')
const { Schema } = mongoose

const forumPostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'ForumComment' }]
}, {
    timestamps: true
})

module.exports = mongoose.model('ForumPost', forumPostSchema)