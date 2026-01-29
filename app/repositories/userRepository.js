import mongoose from 'mongoose';
import User from '../models/User.js';

class UserRepository {
  /**
   * Create a new user
   */
  async create(data) {
    const created = await User.create(data);
    return this._safeUser(created);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    return await User.findOne({ username }).lean();
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const user = await User.findById(id).lean();
    if (!user) return null;
    return {
      id: String(user._id),
      username: user.username,
      email: user.email,
      faceDescriptor: user.faceDescriptor ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update user face descriptor
   */
  async updateFaceDescriptor(userId, descriptor) {
    if (!mongoose.isValidObjectId(userId)) return null;
    const updated = await User.findByIdAndUpdate(
      userId,
      { faceDescriptor: descriptor },
      { new: true }
    );
    if (!updated) return null;
    return this._safeUser(updated);
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const user = await User.findOne({ email }).select({ _id: 1 }).lean();
    return Boolean(user);
  }

  /**
   * Check if username exists
   */
  async usernameExists(username) {
    const user = await User.findOne({ username }).select({ _id: 1 }).lean();
    return Boolean(user);
  }

  _safeUser(doc) {
    const obj = doc?.toObject ? doc.toObject() : doc;
    return {
      id: String(obj._id),
      username: obj.username,
      email: obj.email,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}

export default new UserRepository();
