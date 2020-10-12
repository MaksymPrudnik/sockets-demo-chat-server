const getMessages = async (count, channel, socket, db) => {
    if (!channel) return socket.emit('load messages fail', 'Wrong request');
    const isChannelExist = await db('channels')
        .where('name', channel)
        .then(channels => Boolean(channels.length))
    if (!isChannelExist) return socket.emit('load messages fail', 'No such channel')
    const messages = await db('messages').select().where({channel});
    socket.emit('messages loaded', messages.slice(
        Math.max(messages.length - 10 - count, 0), 
        messages.length - count
    ))
}

const addMessages = async (message, socket, io, db) => {
    if (!message.channel || !message.body.username || (!message.body.message && !message.body.img) ) {
        return socket.emit('message fail', 'Invalid message')
    };
    const messages = await db('messages')
        .returning(['channel', 'username', 'body', 'createdat', 'img'])
        .insert({
            channel: message.channel, 
            username: message.body.username,
            body: message.body.message,
            img: message.body.img,
            createdat: new Date().toLocaleString()
        })
    const newMessage = messages[messages.length-1];
    return io.emit('message added', newMessage);
}

module.exports = {
    addMessages,
    getMessages
}