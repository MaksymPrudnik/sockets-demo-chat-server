const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})

const messages = {};

const io = socket(server);

io.on('connection', () => {
    console.log('Sockets connected')
})

io.on('connect', socket => {

    socket.on('new channel', channel => {
        if (!channel || messages.hasOwnProperty(channel)) return socket.emit('error chanel', 'Invalid chanel or already exist');
        messages[channel] = [];
        io.emit('channel added', channel);
    })

    socket.on('new message', (msg) => {
        if (!msg.channel || !msg.body.username || !msg.body.message ) {
            return socket.emit('message fail', 'Invalid message')
        };
        const newMessage = { ...msg.body, createdAt: new Date().toLocaleString()}
        messages[msg.channel].push(newMessage);
        return io.emit('message added', [msg.channel, newMessage]);
    })

    socket.on('disconnect', () => console.log('user disconnected'))
})

app.get('/', (req, res) => res.send('hello world'));
app.get('/get-messages', (req, res) => {
    res.json(messages);
})
