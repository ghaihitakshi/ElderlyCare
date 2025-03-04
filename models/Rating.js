const mongoose = require('mongoose')
const { Schema } = mongoose

const ratingSchema = new Schema({
    value: { type: Number, required: true },
    comment: { type: String },
    rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: { createdAt: 'createdAt' }
})

module.exports = mongoose.model('Rating', ratingSchema)