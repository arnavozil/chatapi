const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    content: { type: String, required: true  },
    parentChat: { type: String, required: true },
    createdAt: { type: Object, default: new Date() },
    clientId: { type: String, required: true },
    by: { type: String, required: true }  // enum [executive, user, admin]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id
    }
});

module.exports = {
    messageModel: mongoose.model('Message', schema)
};    