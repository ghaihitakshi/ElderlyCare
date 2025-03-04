const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['FAMILY', 'ELDERLY', 'VOLUNTEER'], required: true },
    phoneNumber: { type: String },
    address: { type: String },
    language: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    // Relationships as arrays of ObjectIDs – they will be populated when needed.
    tasksCreated: [{ type: Schema.Types.ObjectId, ref: 'ScheduledTask' }],
    tasksAssigned: [{ type: Schema.Types.ObjectId, ref: 'ScheduledTask' }],
    prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
    groceryOrders: [{ type: Schema.Types.ObjectId, ref: 'GroceryOrder' }],
    emergencyAlerts: [{ type: Schema.Types.ObjectId, ref: 'EmergencyAlert' }],
    chatMessages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
    forumPosts: [{ type: Schema.Types.ObjectId, ref: 'ForumPost' }],
    forumComments: [{ type: Schema.Types.ObjectId, ref: 'ForumComment' }],
    checkIns: [{ type: Schema.Types.ObjectId, ref: 'CheckIn' }],
    healthLogs: [{ type: Schema.Types.ObjectId, ref: 'HealthActivityLog' }],
    ratingsGiven: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    ratingsReceived: [{ type: Schema.Types.ObjectId, ref: 'Rating' }]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)