import { ObjectId } from 'mongoose';

export interface IUser {
  id: ObjectId;
  email: string;
  password?: string;
  userId: {};
  isValidPassword: (password: string) => boolean;
}

export interface IUrl {
  id: ObjectId;
  userId: {};
  fullUrl: {};
  shortUrl: {};
  clicks: {};
  createdAt: {};
  QRCode: {};
}

export interface IHistory {
  id: ObjectId;
  userId: {};
  fullUrl: {};
  shortUrl: {};
  os: {};
  browser: {};
  device: {};
  location: {};
  time: {};
  brand: {};
}
