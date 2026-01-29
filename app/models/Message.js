import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const MessageSchema = new Schema(
  {
    content: { type: String, required: true, trim: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    roomId: { type: Types.ObjectId, ref: 'Room', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);

