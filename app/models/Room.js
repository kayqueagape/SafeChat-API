import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    isPrivate: { type: Boolean, default: true },
    members: [{ type: Types.ObjectId, ref: 'User', index: true }],
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);

