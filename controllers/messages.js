const getMessages = async (count, channel, socket, db) => {
  if (!socket || !db) throw new Error("Dependencies error");
  if (!channel || !count)
    return socket.emit("load messages fail", "Wrong request");
  const isChannelExist = await db("channels")
    .where("name", channel)
    .then((channels) => Boolean(channels.length));
  if (!isChannelExist)
    return socket.emit("load messages fail", "No such channel");
  const messages = await db("messages").select().where({ channel });
  const returnMessages = getRequestedMessages(messages, count);
  socket.emit("messages loaded", returnMessages);
};

const addMessages = async (message, socket, io, db) => {
  if (
    !message.channel ||
    !message.body ||
    !message.body.username ||
    (!message.body.message && !message.body.img)
  ) {
    return socket.emit("message fail", "Invalid message");
  }
  const messages = await db("messages")
    .returning(["channel", "username", "body", "createdat", "img"])
    .insert({
      channel: message.channel,
      username: message.body.username,
      body: message.body.message,
      img: message.body.img,
      createdat: new Date().toLocaleString(),
    });
  const newMessage = messages[messages.length - 1];
  return io.emit("message added", newMessage);
};

const getRequestedMessages = (messagesList, messagesCount) => {
  if (!Array.isArray(messagesList) || !Number.isInteger(messagesCount))
    return "error";
  if (messagesList.length === 0) return [];
  const returnMessages = messagesList.slice(
    Math.max(messagesList.length - 10 - messagesCount, 0),
    messagesList.length - messagesCount
  );
  return returnMessages;
};

module.exports = {
  addMessages,
  getMessages,
  getRequestedMessages,
};
