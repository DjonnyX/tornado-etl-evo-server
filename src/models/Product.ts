import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IProductDocument extends Document {
    productId: string;
    name: string;
    description?: string;
    eventVersion: number;
}

const ProductSchema = new Schema({
    productId: { type: String, unique: true, require: true },
    name: { type: String, unique: true, require: true },
    description: { type: String, require: false },
    eventVersion: { type: Number, default: -1 },
});

export const ProductModel = mongoose.model<IProductDocument>("Product", ProductSchema);