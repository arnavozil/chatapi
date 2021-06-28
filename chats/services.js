const { oid } = require('../helpers/middlewares');
const { Chat, Executive, Message } = require("../helpers/db")
const get = require('lodash/get');
const { findLastMessage } = require('./../messages/services');
const moment = require('moment');
const { randomWord } = require('../helpers/utils');

const initiateChat = async ({chatTitle: title, createdAt, username}) => {
    if(!title) throw 'Please provide an explanation for your query';
    let referenceId = moment(createdAt).format('DDMMYYYY') + randomWord();
    let doc = await Chat.findOne({ referenceId });
    while(Boolean(doc)){
        referenceId = moment(createdAt).format('DDMMYYYY') + randomWord();
        doc = await Chat.findOne({ referenceId });
    };
    const chat = new Chat({ title, createdAt, referenceId, username });
    const savedChat = await chat.save();
    return { chat: savedChat };
};

const byId = async id => {
    const chat = await Chat.findOne({ referenceId: id[0] === '#' ? id.substring(1) : id });
    const messages = await Message.find({ parentChat: chat.id });
    return { chat, messages };
};

const getChatById = async (id, exId) => {
    if(!id && !exId){
        return await Chat.find({ $or: [ { response: 'started' }, {
            $and: [{ answeredBy: '' }, { response: 'ended' }]
        }] });
        // return await findLastMessage(chats);
    };
    const query = { $or: [] };
    if(id) query['$or'].push({ _id: oid(id) });
    if(exId) query['$or'].push({ answeredBy: oid(exId) });
    return await Chat.find(query);
};  

const findChatAndLastMessages = async exId => {
    const chats = await Chat.find({
        $or: [ { 
            response: 'started' 
        }, { 
            $and: [ { answeredBy: '' }, { response: 'ended' } ] 
        }, {
            answeredBy: exId
        } ]
    });
    const res = {};
    const withMessages = await findLastMessage(chats);
    withMessages.forEach(({ id, lastMessage }) => {
        res[id] = lastMessage;
    });
    return res;
}

const joinChat = async ({chatId, userId}) => {
    const chat = await Chat.findById(chatId);
    if(get(chat, 'answeredBy', '') !== '' && get(chat, 'response') === 'accepted') 
        throw 'This query is either resolved or being resolved. Please choose a different query';
    await Chat.findByIdAndUpdate(chatId, {
        $set: { answeredBy: userId, response: 'accepted' }
    });
    await Executive.findByIdAndUpdate(userId, {
        $inc: { answered: 1 },
        $set: { status: 'onchat' }
    });
    return chatId;
};

const endChat = async chatId => {
    await Chat.findByIdAndUpdate(chatId, {
        $set: { response: 'ended' }
    });
    const chat = await Chat.findById(chatId);
    if(!chat.answeredBy) return { chat, short: true };
    await Executive.findByIdAndUpdate(chat.answeredBy, {
        $set: { status: 'online' }
    });
    return { chat, short: false };
};

const feedReview = async ({chatId, impact}) => {
    
    const chat = await Chat.findByIdAndUpdate(chatId, {
        $set: { isReviewed: true }
    });
    if(!chat.answeredBy) return;
    const key = impact ? 'satisfied' : 'dissatisfied';
    const up = await Executive.findByIdAndUpdate(chat.answeredBy, {
        $inc: { [key]: 1 }
    });
};

const setSocket = async (chatId, socketId) => await Chat.findByIdAndUpdate(chatId, {
    $set: { userSocket: socketId }
});

const findChatBySocket = async id => await Chat.findOne({ userSocket: id });


module.exports = {
    initiateChat,
    getChatById,
    joinChat,
    endChat,
    feedReview,
    setSocket, byId,
    findChatBySocket,
    findChatAndLastMessages
};