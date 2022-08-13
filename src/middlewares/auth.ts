import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { UNAUTHORIZED_ERROR_TEXT } from '../consts';
import { TUserType } from '../services/types';

const { NODE_ENV, JWT_SECRET, DEV_JWT_SECRET } = require('../config');

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(UNAUTHORIZED_ERROR_TEXT);
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError(UNAUTHORIZED_ERROR_TEXT);
    }

    req.user = payload as TUserType;

    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
