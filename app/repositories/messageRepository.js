import mongoose from 'mongoose';
import Message from '../models/Message.js';

class MessageRepository {
  /**
   * Create a new message
   */
  async create(data) {
    const created = await Message.create({
      content: data.content,
      userId: data.userId,
      roomId: data.roomId,
    });
    const msg = await Message.findById(created._id)
      .populate('userId', 'username email')
      .populate('roomId', 'name')
      .lean();

    return {
      id: String(msg._id),
      content: msg.content,
      userId: String(msg.userId?._id ?? msg.userId),
      roomId: String(msg.roomId?._id ?? msg.roomId),
      createdAt: msg.createdAt,
      user: msg.userId && msg.userId.username ? {
        id: String(msg.userId._id),
        username: msg.userId.username,
        email: msg.userId.email,
      } : undefined,
      room: msg.roomId && msg.roomId.name ? {
        id: String(msg.roomId._id),
        name: msg.roomId.name,
      } : undefined,
    };
  }

  /**
   * Get messages for a room
   */
  async getRoomMessages(roomId, limit = 50, cursor = null) {
    if (!mongoose.isValidObjectId(roomId)) return [];
    const query = { roomId };

    if (cursor && mongoose.isValidObjectId(cursor)) {
      query._id = { $lt: cursor };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username email')
      .lean();

    return messages.map((m) => ({
      id: String(m._id),
      content: m.content,
      userId: String(m.userId?._id ?? m.userId),
      roomId: String(m.roomId),
      createdAt: m.createdAt,
      user: m.userId && m.userId.username ? {
        id: String(m.userId._id),
        username: m.userId.username,
        email: m.userId.email,
      } : undefined,
    }));
  }

  /**
   * Get message by ID
   */
  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const m = await Message.findById(id)
      .populate('userId', 'username email')
      .populate('roomId', 'name')
      .lean();
    if (!m) return null;
    return {
      id: String(m._id),
      content: m.content,
      userId: String(m.userId?._id ?? m.userId),
      roomId: String(m.roomId?._id ?? m.roomId),
      createdAt: m.createdAt,
      user: m.userId && m.userId.username ? {
        id: String(m.userId._id),
        username: m.userId.username,
        email: m.userId.email,
      } : undefined,
      room: m.roomId && m.roomId.name ? {
        id: String(m.roomId._id),
        name: m.roomId.name,
      } : undefined,
    };
  }
}

export default new MessageRepository();
