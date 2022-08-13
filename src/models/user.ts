import mongoose, { Model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/unauthorized-error';
import { TUserType } from '../services/types';

type UserModel = Model<TUserType> & {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials(email: string, password: string): Promise<TUserType>;
}

const userSchema = new mongoose.Schema<TUserType, UserModel>({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (v: string) => /^https?:\/\/(www\.)?[a-zA-Z0-9-]*\.[a-zA-Z0-9]*\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)#?/.test(v),
      message: 'Неправильный формат адреса',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user: TUserType | null) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

export default mongoose.model<TUserType, UserModel>('user', userSchema);
