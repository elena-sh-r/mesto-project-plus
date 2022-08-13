import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TUserType } from '../services/types';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import { NOT_FOUND_USER_ERROR_TEXT } from '../consts';

const { NODE_ENV, JWT_SECRET, DEV_JWT_SECRET } = require('../config');

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;

  bcrypt.hash(user.password, 10)
    .then((hash) => User.create({ ...user, password: hash }))
    .then((newUser) => res.send({ data: { ...newUser, password: null } }))
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(req.user?._id, req.body, { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(NOT_FOUND_USER_ERROR_TEXT);
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(NOT_FOUND_USER_ERROR_TEXT);
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user: TUserType) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
