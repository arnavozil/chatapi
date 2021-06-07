const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    answeredBy: { type: String, default: '' },
    referenceId: { type: String, required: true },
    createdAt: { type: Object, default: new Date() },
    title: { type: String, required: true },
    isReviewed: { type: Boolean, default: false },
    userSocket: { type: String, default: '' },
    response: { type: String, default: 'started' } // enum [accepted, started, ended]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id
    }
});

module.exports = {
    chatModel: mongoose.model('Chat', schema)
};