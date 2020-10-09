const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const knex = require('knex');
const aws = require('aws-sdk');
const dotenv = require('dotenv');

const channels = require('./controllers/channels');
const messages = require('./controllers/messages');
const awsS3 = require('./controllers/awsS3');

dotenv.config()

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
})

aws.config.region = 'eu-central-1';

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

app.get('/sign-s3', (req, res) => awsS3.handleSignS3(req, res, aws));