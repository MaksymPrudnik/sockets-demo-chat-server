const getChannels = async (socket, db) => {
    const channels = await db.select().from('channels')
    socket.emit('channels loaded', channels)
}

const addChannel = async (channel, socket, io, db) => {
    if (!channel) return socket.emit('error chanel', 'Invalid request');
    const isChannelExist = await db('channels').where('name', channel).then(channels => Boolean(channels.length))
    if (isChannelExist) return socket.emit('error chanel', 'Channel already exist');
    await db('channels').insert({name: channel});
    io.emit('channel added', {name: channel});
}

module.exports = {
    getChannels,
    addChannel
}