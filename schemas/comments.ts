import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
