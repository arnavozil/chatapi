const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    createdAt: { type: Object, default: new Date() },
    title: { type: String, required: true },
    response: { type: String, default: 'started' } // enum [accepted, started]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id
    }
});

module.exports = {
    alertModel: mongoose.model('Alert', schema)
};