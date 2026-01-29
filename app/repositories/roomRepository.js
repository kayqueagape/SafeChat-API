import mongoose from 'mongoose';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

class RoomRepository {
  /**
   * Create a new room
   */
  async create(data) {
    // expected: { name, description, isPrivate, members: { create: { userId } } }
    const userId = data?.members?.create?.userId;
    const created = await Room.create({
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate ?? true,
      members: userId ? [userId] : [],
    });

    const populated = await Room.findById(created._id)
      .populate('members', 'username email')
      .lean();

    return this._shapeRoom(populated);
  }

  /**
   * Find room by ID
   */
  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const room = await Room.findById(id)
      .populate('members', 'username email')
      .lean();
    if (!room) return null;

    const messages = await Message.find({ roomId: room._id })
      .sort({ createdAt: 1 })
      .populate('userId', 'username email')
      .lean();

    return {
      ...this._shapeRoom(room),
      messages: messages.map((m) => ({
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
      })),
    };
  }

  /**
   * Add user to room
   */
  async addMember(roomId, userId) {
    if (!mongoose.isValidObjectId(roomId) || !mongoose.isValidObjectId(userId)) return null;
    const updated = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { members: userId } },
      { new: true }
    )
      .populate('members', 'username email')
      .lean();

    return updated ? this._shapeRoom(updated) : null;
  }

  /**
   * Remove user from room
   */
  async removeMember(roomId, userId) {
    if (!mongoose.isValidObjectId(roomId) || !mongoose.isValidObjectId(userId)) return null;
    await Room.findByIdAndUpdate(roomId, { $pull: { members: userId } });
    return { success: true };
  }

  /**
   * Check if user is member of room
   */
  async isMember(roomId, userId) {
    if (!mongoose.isValidObjectId(roomId) || !mongoose.isValidObjectId(userId)) return false;
    const room = await Room.findOne({ _id: roomId, members: userId }).select({ _id: 1 }).lean();
    return Boolean(room);
  }

  /**
   * Get all rooms for a user
   */
  async getUserRooms(userId) {
    if (!mongoose.isValidObjectId(userId)) return [];
    const rooms = await Room.find({ members: userId })
      .sort({ updatedAt: -1 })
      .populate('members', 'username email')
      .lean();

    const roomIds = rooms.map((r) => r._id);
    const counts = await Message.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      { $group: { _id: '$roomId', messages: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.messages]));

    return rooms.map((r) => ({
      ...this._shapeRoom(r),
      _count: { messages: countMap.get(String(r._id)) ?? 0 },
    }));
  }

  _shapeRoom(room) {
    if (!room) return null;
    return {
      id: String(room._id),
      name: room.name,
      description: room.description ?? null,
      isPrivate: Boolean(room.isPrivate),
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      members: (room.members || []).map((m) =>
        m && m.username
          ? { user: { id: String(m._id), username: m.username, email: m.email } }
          : { user: { id: String(m), username: undefined, email: undefined } }
      ),
    };
  }
}

export default new RoomRepository();
