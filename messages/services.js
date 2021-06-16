const { Message, Chat } = require('../helpers/db');

const createMessage = async params => {
    const message = new Message(params);
    return await message.save();
};

const retrieveAll = async (parentChat) => {
    const chat = await Chat.findById(parentChat);
    const messages = await Message.find({ parentChat });
    return [messages, (chat && chat.response !== 'ended'), chat];
};

const updateMessages = async (messages = []) => {
    messages = messages.filter((v,i,a) => a.findIndex(t => (t._id === v._id)) === i);
    const res = await Message.insertMany(messages, [
        { ordered: false }
    ]);
};

const findLastMessage = chats => Promise.all(chats.map(async chat => {
    const { response, title, createdAt, id, answeredBy } = chat;
    if(chat.response === 'started') return chat;
    const message = await Message
        .find({ $and: [
            { parentChat: id },
            { by: { $ne: 'admin' } }
        ] })
        .sort({ _id: -1 })
        .limit(1);
    const { content, by, createdAt: at } = (message[0] || {});
    return { response, title, id, createdAt, lastMessage: { content, by, at }, answeredBy };
}));

module.exports = {
    createMessage,
    retrieveAll,
    updateMessages,
    findLastMessage
};