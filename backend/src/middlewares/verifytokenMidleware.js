import jwt from 'jsonwebtoken';
import { env } from '../config/enviroment.js';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

const createToken = (User, Secret, Tokenlife) => {
  const token = jwt.sign(User, Secret, {
    algorithm: 'HS256',
    expiresIn: Tokenlife,
  });
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ', 'auth', 'BR_auth'));
      }
      req.user = user;
      next();
    });
  } else {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn chưa được xác thực', 'auth', 'BR_auth'));
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (req.user.role === 'Admin') {
      next();
    } else {
      return next(new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Bạn không được phép thực hiện hành động này',
        'auth',
        'BR_auth',
      ));
    }
  });
};

export const verifyTokenMidleware = {
  createToken,
  verifyToken,
  verifyTokenAndAdmin,
};
