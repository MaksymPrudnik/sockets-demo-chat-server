const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const knex = require('knex');

const channels = require('./controllers/channels');
const messages = require('./controllers/messages');

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
})

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})

const io = socket(server);

io.on('connect', socket => {
    socket.on('load channels', () => channels.getChannels(socket, db))

    socket.on('new channel', channel => channels.addChannel(channel, socket, io, db))

    socket.on('new message', (msg) => messages.addMessages(msg, socket, io, db))

    socket.on('load messages', ({count, channel}) => messages.getMessages(count, channel, socket, db))
})
