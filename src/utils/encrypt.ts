import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { payload } from '../dto/user.dto';

dotenv.config();

const { JWT_SECRET = '' } = process.env;

export class encrypt {
    static async encryptPassword(password: string) {
        return bcrypt.hashSync(password, 12);
    }

    static comparedPassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(payload: payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    }
}
