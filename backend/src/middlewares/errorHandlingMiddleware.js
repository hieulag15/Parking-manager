/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes';
// import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {
  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  if (err.message.includes('MongoServerError: E11000 duplicate'))
  {
    err.message = 'SDT hoặc Email bị trùng';
  }
  if (!err.type) err.type = 'Undefined';
  if (!err.code) err.code = 'BR_undefined';
  console.log(err.message)
  console.log(err.stack)
  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    type: err.type,
    code: err.code,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  };

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError);
};
