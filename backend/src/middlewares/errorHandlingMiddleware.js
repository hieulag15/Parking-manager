import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    err = new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || 'Internal Server Error',
      err.type || 'Undefined',
      err.code || 'BR_undefined'
    );
  }

  const responseError = {
    statusCode: err.statusCode,
    type: err.type,
    code: err.code,
    message: err.message,
  };

  res.status(responseError.statusCode).json(responseError);
};
