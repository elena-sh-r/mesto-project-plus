import { NextFunction, Request, Response } from 'express';
import { IError } from '../services/types';
import ValidationError from '../errors/validation-error';
import ConflictingError from '../errors/conflicting-error';
import { COMMON_ERROR_TEXT } from '../consts';

const COMMON_ERROR_CODE = 500;

const getValidError = (err: IError) => {
  if (err.statusCode) {
    return err;
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return new ValidationError(err.message);
  }

  if ((err.name === 'MongoError' || err.name === 'MongoServerError') && err.code === 11000) {
    return new ConflictingError(err.message);
  }

  return { ...err, statusCode: COMMON_ERROR_CODE };
};

const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = getValidError(err);

  res
    .status(statusCode)
    .send({
      message: statusCode === COMMON_ERROR_CODE
        ? COMMON_ERROR_TEXT
        : message,
    });

  next();
};

export default errorHandler;
