import mongoose from 'mongoose';
import { TUserType } from '../services/types';

const userSchema = new mongoose.Schema<TUserType>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/.test(v),
      message: 'Неправильный формат адреса',
    },
  },
}, { versionKey: false });

export default mongoose.model<TUserType>('user', userSchema);
