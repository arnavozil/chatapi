const { connectionString, localConnectionString } = require('../config.json');
const mongoose = require('mongoose');
const { executiveModel } = require('../executives/model');
const { chatModel } = require('../chats/model');
const { messageModel } = require('../messages/model');
const { alertModel } = require('../alerts/model');

let url = connectionString;
if(process.env.NODE_ENV === 'development'){
    url = localConnectionString;
}

mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.Promise = global.Promise;

module.exports = {
    Executive: executiveModel,
    Chat: chatModel,
    Message: messageModel,
    Alert: alertModel,
};