const { getChatById, endChat, setSocket, findChatBySocket } = require("../chats/services");
const { createMessage, retrieveAll, updateMessages } = require("../messages/services");
const { Executive } = require("./db");

module.exports = io => {
    io.on('connect', socket => {
        
        let userChats = [];
        let userId = '';
        socket.on('EXECUTIVE_CONNECTED', async ({ id }) => {
            userId = id;
            await Executive.findByIdAndUpdate(id, {
                $set: { status: 'online' }
            });
        });
        
        socket.on('SEARCH_EXECUTIVES', async ({ id, executiveId }) => {
            const chats = await getChatById(id, executiveId);
            chats.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
            io.emit(executiveId ? `${executiveId}_INCOMING_CHAT_ME` : 'INCOMING_CHAT', chats);
        });
        
        socket.on('SEND_MESSAGE', async params => {
            const { parentChat } = params;
            createMessage(params);
            userChats.push(params);
            io.emit(`${parentChat}_MESSAGE_RECEIVED`, params);
        });

        socket.on('ALL_MESSAGES', async ({ parentChat }) => {
            const [allMessages, isAlive, chat] = await retrieveAll(parentChat);
            userChats = allMessages;
            if(!isAlive) io.emit(parentChat + '_CHAT_FINISHED', { isReviewed: chat.isReviewed });
            io.emit(parentChat + '_ALL_MESSAGES', userChats);
        });

        socket.on('SET_USER_SOCKET', async ({ chatId }) => await setSocket(chatId, socket.id));

        socket.on('END_CHAT', async ({ chatId }) => {
            const { chat, short } = await endChat(chatId);
            io.emit(chatId + '_CHAT_FINISHED', { isReviewed: chat.isReviewed, short });
        });

        socket.on('LAST_MESSAGE', ({
            parentChat, content, by, at, highlight = false
        }) => io.emit(`${parentChat}_LAST_MESSAGE`, {
            content, by, at, highlight
        }));

        socket.on('START_TYPING', ({ chatId, by }) => io.emit(chatId + '_TYPING_STATUS', { [by]: true }));

        socket.on('END_TYPING', ({ chatId, by }) => io.emit(chatId + '_TYPING_STATUS', { [by]: false }));

        socket.on('disconnect', async () => {
            const chat = await findChatBySocket(socket.id);
            if(chat){
                const { id } = chat;
                const { chat: c, short } = await endChat(chat.id);
                io.emit(id + '_CHAT_FINISHED', { isReviewed: c.isReviewed, short });
            }
            if(!userId) return;
            await Executive.findByIdAndUpdate(userId, {
                $set: { status:'offine' }
            });
            userId = '';
        });
    });  
};