const mongoose = require('mongoose')
const { Schema } = mongoose

const checkInSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    checkInTime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('CheckIn', checkInSchema)