import { validateToken } from '../utils';
import HttpError from '../utils/http.error';
import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const payload = validateToken(token);
        
        if (payload['token'] !== 'access') {
            throw new HttpError({
                title: 'unauthorized',
                detail: 'Invalid Authorization header',
                code: 401,
            });
        }
        req['authentication'] = payload;
        next();
    } catch (error) {
        if (error.opts?.title === 'invalid_token') {
            next(
                new HttpError({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                }),
            );
        } else {
            next(error);
        }
    }
};

export default auth;
