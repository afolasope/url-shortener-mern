import { Schema, model } from 'mongoose';
import { IUrl } from '../types';
import shortid from 'shortid';

const urlSchema = new Schema<IUrl>({
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
    required: false,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now(),
    immutable: true,
  },
  QRCode: {
    type: String,
  },
});

export const ShortUrl = model<IUrl>('Url', urlSchema);
