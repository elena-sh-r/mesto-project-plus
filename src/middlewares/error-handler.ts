import ValidationError from '../errors/validation-error';
import ConflictingError from '../errors/conflicting-error';
import { COMMON_ERROR_TEXT } from '../consts';
import { NextFunction } from 'express';

const COMMON_ERROR_CODE = 500;

const getValidError = (err: any) => {
  if (err.statusCode) {
    return err;
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return new ValidationError(err.message);
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return new ConflictingError(err.message);
  }

  return { ...err, statusCode: COMMON_ERROR_CODE };
};

const errorHandler = (err: any, req: Request, res: any, next: NextFunction) => {
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