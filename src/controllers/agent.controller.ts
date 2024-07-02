import { jsonAll } from '../utils/general';
import {Request, Response, NextFunction} from 'express';

const getAgentList = async (req: Request, res: Response, next: NextFunction) => {
    return jsonAll<any>(res, 200, 'hello world');
};

export default {getAgentList};
