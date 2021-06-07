const mongoose = require('mongoose');
const { Schema } = mongoose;


const schema = new Schema({
    hash: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    answered: { type: Number, default: 0 },
    createdAt: { type: Object, default: new Date() },
    satisfied: { type: Number, default: 0 },
    dissatisfied: { type: Number, default: 0 },
    status: { type: String, default: 'offline' } // enum [online, offline, onchat]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id,
        delete ret.hash
    }
});

module.exports = {
    executiveModel: mongoose.model('Executive', schema)
};    