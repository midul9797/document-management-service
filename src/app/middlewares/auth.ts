/* eslint-disable no-console */
import { NextFunction, Response, Request } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import config from '../../config';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    let verifiedUser = null;

    verifiedUser = jwtHelpers.decodeToken(token);
    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};
export default auth;
