const mongoose = require('mongoose')
const { Schema } = mongoose

const forumCommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('ForumComment', forumCommentSchema)