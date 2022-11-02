/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
import { ErrorRequestHandler } from 'express';
import BaseError from './BaseError';
import DocumentNotFoundError from './DocumentNotFoundError';
import ServerError from './ServerError';

dotenv.config();

const createError = (err: any): BaseError => {
  switch (true) {
    case err instanceof BaseError:
      return err;
    case err.kind === 'ObjectId':
      return new DocumentNotFoundError(err.value);
    default:
      return new ServerError(err.message ?? '');
  }
};

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const error = createError(err);
  const message = error.code < 500
    ? 'Request error'
    : 'Server error';

  if (process.env.DEBUG && process.env.DEBUG === 'true') {
    console.log(err);
  }
  res.status(error.code).json({ message, errors: [error.message] });
};

export default errorHandler;
