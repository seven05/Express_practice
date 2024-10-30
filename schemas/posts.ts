import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
	title: string;
	author: string;
	content: string;
	password: string;
	createdAt: Date;
}

const PostSchema: Schema = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	content: { type: String, required: true },
	// password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>('Post', PostSchema);
