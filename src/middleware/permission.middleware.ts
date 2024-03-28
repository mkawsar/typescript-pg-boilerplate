import HttpError from '../utils/http.error';
import { NextFunction, Response, Request } from 'express';

const permission = function (allowRules: Array<string>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const payload = req['tokenPayload'];
        if (allowRules.includes(payload['role'])) {
            next();
        } else {
            next(
                new HttpError({
                    title: 'forbidden',
                    detail: 'Access Forbidden',
                    code: 403,
                })
            );
        }
    }
};

export default permission;
