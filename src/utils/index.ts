import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import HttpError from './http.error';
import { AppDataSource } from '../data-source';
import { Otp } from '../entity/Otp.entity';

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

// verify otp
const verifyOtp = async function (userId: any, otp: string, type: string): Promise<any> {
    // let existOtp = await OTP.findOne({ userId, otp, type });
    const otpRespository = AppDataSource.getRepository(Otp);
    const existOtp = await otpRespository.findOne({
        where: {otp: otp, status: type}
    });

    let date = new Date(existOtp.expiration);

    const currentDate = new Date();
    if (!existOtp && date > currentDate) {
        return null;
    }

    return existOtp.id;
};

// USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
// THE PAYLOAD CONTAINS THE DATA WHICH WILL BE SET AS JWT PAYLOAD.
// OPTIONS CONTAIN JWT OPTIONS
const generateJWT = function (payload: object = {}, options: object = {}): string {
    const privateKey: any = JWT_SECRET;
    const defaultOptions: object = {
        expiresIn: '23h',
    };
    return jwt.sign(
        payload,
        privateKey,
        Object.assign(defaultOptions, options)
    );
};

//USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
const extractToken = function (token: string): string | null {
    if (token?.startsWith('Bearer ')) {
        return token.slice(7, token.length);
    }
    return null;
};

export { extractToken, generateJWT, generateOTP, validateToken, verifyOtp };
