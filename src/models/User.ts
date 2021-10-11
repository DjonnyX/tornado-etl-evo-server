import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
    userId: string;
    email: string;
    password: string;
}

const UserSchema = new Schema({
    userId: { type: String, unique: true, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);