import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IServerJob {
    startAt: Date;
    isProcess: boolean;
}

export interface IServerJobs {
    syncStores: IServerJob;
    syncTerminals: IServerJob;
    syncProducts: IServerJob;
}

export interface IServerJobDocument extends Document, IServerJob { }

const ServerJobSchema = new Schema({
    startAt: { type: Date, require: true, default: new Date() },
    isProcess: { type: String, require: true, default: false },
});

export interface IServerJobsDocument extends Document {
    syncStores: IServerJobDocument;
    syncTerminals: IServerJobDocument;
    syncProducts: IServerJobDocument;
}

const ServerJobsSchema = new Schema({
    syncStores: { type: ServerJobSchema },
    syncTerminals: { type: ServerJobSchema },
    syncProducts: { type: ServerJobSchema },
});

export interface IServerDocument extends Document {
    token: string;
    jobs: {
        syncStores: IServerJob;
        syncTerminals: IServerJob;
        syncProducts: IServerJob;
    }
}

const ServerSchema = new Schema({
    token: { type: String, default: "empty" },
    jobs: {
        type: ServerJobsSchema,
        default: {
            syncStores: {
                startAt: new Date(),
                isProcess: false,
            },
            syncTerminals: {
                startAt: new Date(),
                isProcess: false,
            },
            syncProducts: {
                startAt: new Date(),
                isProcess: false,
            },
        },
    },
});

export const ServerModel = mongoose.model<IServerDocument>("Server", ServerSchema);