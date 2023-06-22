import { Schema, model } from 'mongoose';
import { IHistory, } from '../types';

const historySchema = new Schema<IHistory>({
  id: Schema.Types.ObjectId,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  time: {
    type: Schema.Types.Date,
    default: Date.now(),
    immutable: true,
  },
  device: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

export const History = model<IHistory>('History', historySchema);
