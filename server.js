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

const io = socket(server);

io.on('connection', () => {
    console.log('Sockets connected')
})

io.on('connect', sockets => {

    sockets.on('new message', (msg) => {
        if (!msg.username || !msg.message ) {
            return sockets.emit('message fail', 'Invalid message')
        };
        const newMessage = { ...msg, createdAt: new Date().toLocaleString()}
        messages.push(newMessage);
        return sockets.emit('message added', newMessage);
    })

    sockets.on('disconnect', () => console.log('user disconnected'))
})

const messages = [];

app.get('/', (req, res) => res.send('hello world'));
app.get('/get-messages', (req, res) => {
    res.json(messages);
})