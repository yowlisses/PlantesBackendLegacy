import { io } from '../io.js';
import { toID } from '../utils/toID.js';
import { checkNotUndefined } from '../utils/checkNotUndefined.js';
import { Chat, Message, User } from '../db/entities.js';
import { notifyMessage } from '../notification/notifyMessage.js';

export const ChatController = {
  async sendMessage(req, res) {
    const { text, toUserId, chatId } = req.body;
    const { userId: fromUserId } = req;
    // const fromUserId = '614db83ba986fc8433007177';

    checkNotUndefined({ text });

    if (!chatId && !toUserId) {
      return res.status(400).send({ error: 'No chatId or toUserId provided' });
    }

    let chat;
    const fromUser = toID(fromUserId);

    if (chatId) {
      chat = await Chat
        .findOne({
          _id: toID(chatId),
          users: fromUser,
        });

      if (!chat) {
        return res.status(404).send({ error: 'Chat not found' });
      }
    } else if (toUserId) {
      const toUser = toID(toUserId);
      chat = await Chat.findOne({
        private: true,
        users: { $all: [fromUser, toUser] },
      });

      if (!chat) {
        const user = await User.findById(toUser);

        if (!user) {
          return res.status(404).send({ error: 'User not found' });
        }
        chat = new Chat({
          users: [fromUser, toUser],
          creator: fromUser,
          private: true,
        });
        await chat.save();
      }
    }

    const newMessage = Message({ text, userId: fromUserId, chatId: chat._id });
    await newMessage.save();

    io.to(toUserId).emit('message', { message: newMessage });
    await notifyMessage(toUserId);

    return res.send(newMessage);
  },

  async getUserChats(req, res) {
    const { userId } = req;
    const chats = await Chat.find({ users: toID(userId) });
    res.send(chats);
  },

  async getChatMessages(req, res) {
    const { id } = req.params;
    const { userId } = req;
    checkNotUndefined({ id });
    const chat = await Chat // return a single item array
      .findById(toID(id))
      .find({ users: toID(userId) });

    if (chat.length === 0) {
      return res.status(404).send({ error: 'Chat not found' });
    }

    const messages = await Message
      .find({ chatId: id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.send(messages);
  },

  async getPrivateChatByUser(req, res) {
    const { userId: currentUserId } = req;
    const { userId: otherUserId } = req.body;

    if (currentUserId === otherUserId) {
      return res.status(400).send({ error: 'User id (param) must be diferent from current user id' });
    }

    checkNotUndefined({ userId: otherUserId });

    const chat = await Chat.findOne({
      private: true,
      users: { $all: [toID(currentUserId), toID(otherUserId)] },
    });

    return res.send(chat);
  },
};
