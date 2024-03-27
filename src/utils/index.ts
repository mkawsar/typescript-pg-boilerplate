import * as dotenv from 'dotenv';
// import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import HttpError from './http.error';

dotenv.config();

const { JWT_SECRET = '' } = process.env;

// Validate auth token
const validateToken = function (token: string): Object {
    try {
        const publicKey: any = JWT_SECRET;
        return jwt.verify(token, publicKey);
    } catch (e) {
        throw new HttpError({
            title: 'invalid_token',
            detail: 'Invalid token',
            code: 400,
        });
    }
}


// Generate OTP
const generateOTP = function (len: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < len; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
}

export { generateOTP, validateToken };
