const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
const cookieParser = require('cookie-parser');
const { frontendClient, localFrontendClient, homeFrontendClient } = require('./config.json');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('./helpers/jwt');
const userRoutes = require('./executives/routes');
const chatRoutes = require('./chats/routes');
const messageRoutes = require('./messages/routes');
const errorHandler = require('./helpers/errorHandler');
const { Chat, Message, Alert } = require('./helpers/db');
require('./helpers/sockets')(io);

const PORT = process.env.PORT || 4000;
const isLocal = !process.env.PORT;
const isHome = process.env.NODE_ENV === 'home';

app.use('/cleanup', async (req, res) => {
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await Alert.deleteMany({});
    const titles = '0123456789abcdef';
    const docs = titles.split('').map(t => ({ title: t, createdAt: new Date() }));
    // await Chat.insertMany(docs);
    res.send('cleanup complete');
});

// cookie parser --> parse in the http cookie
app.use(cookieParser());

// body parser and cors boilerplate
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(cors({
    origin: isHome ? homeFrontendClient : isLocal ? localFrontendClient : frontendClient,
    credentials: true
}));

// authenticating routes via JsonWebToken
// app.use(jwt());

// api routes
app.use('/executives', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

// error handling
app.use(errorHandler);

// listening to the server
http.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});