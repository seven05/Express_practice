import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
	nickname: string;
	password: string;
}

const UserSchema: Schema = new Schema({
	nickname: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
