const mongoose = require('mongoose')
const { Schema } = mongoose

const groceryOrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    // Storing items as a mixed type to allow flexible JSON structure.
    items: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['REQUESTED', 'ACCEPTED', 'COMPLETED', 'CANCELLED'], default: 'REQUESTED' }
}, {
    timestamps: true
})

module.exports = mongoose.model('GroceryOrder', groceryOrderSchema)