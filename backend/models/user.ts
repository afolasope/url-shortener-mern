import { Schema, model, connect } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
});

userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password as string, 10);

  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

export const User = model<IUser>('User', userSchema);
