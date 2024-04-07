import { hash } from 'bcrypt';
import { IUser } from '../interfaces';
import { generateOTP } from '../utils';
import { Otp } from '../entity/Otp.entity';
import { Status, OtpType } from '../enums';
import HttpError from '../utils/http.error';
import { User } from '../entity/User.entity';
import { AppDataSource } from '../data-source';
import MailService from '../services/mail.service';
import { jsonAll, jsonOne } from '../utils/general';
import { Request, Response, NextFunction } from 'express';
import verifyEmailTemplate from '../templates/verify.template';

//CREATE USER & SEND MAIL FOR VERIFICATION
const registration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, role, password } = req?.body;
        const userRepository = AppDataSource.getRepository(User);
        
        const existUser = await userRepository.findOne({where: { email: email }});
        if (existUser) {
            throw new HttpError({
                title: 'email_address',
                detail: 'Email address is already used',
                code: 422,
            });
        }

        const hashPassword = await hash(password, 12);
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashPassword;
        user.role = role;
        await userRepository.save(user);

        // GENERATE OTP FOR MAIL VERIFICATION
        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 59);

        const otp: string = generateOTP(6);

        const otpRepository = AppDataSource.getRepository(Otp);
        const newOTP = new Otp();
        newOTP.expiration = new Date(tokenExpiration);
        newOTP.otp = otp;
        newOTP.user = user;
        newOTP.status = OtpType.VERIFICATION;
        await otpRepository.save(newOTP);

        //SEND VERIFICATION MAIL TO USER
        const emailTemplate = verifyEmailTemplate(otp);
        const mailService = MailService.getInstance();
        await mailService.send(req.headers['X-Request-Id'], {
            from: 'kawsar.diu888@gmail.com',
            to: user.email,
            subject: 'Verify OTP',
            html: emailTemplate.html,
        });

        //SENDING RESPONSE
        return jsonOne<IUser>(res, 201, user);
    } catch (error) {
        next(error);
    }
};


// Verify
const verification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        
        // User Repository
        const userRepository = AppDataSource.getRepository(User);
        // OTP Respository
        const otpRepository = AppDataSource.getRepository(Otp);

        //Find user
        const user = (await userRepository.findOne({where: { email: email }}));

        if (!user) {
            throw new HttpError({
                title: 'not_found',
                detail: 'The request data not found',
                code: 404,
            });
        } else if (user.is_email_verified) {
            return jsonOne<string>(res, 200, 'User email is already verified.');
        }

        const getOTP = await otpRepository.findOne({
            relations: ['user'],
            where: {
                otp: otp,
                status: OtpType.VERIFICATION,
                user: { id: user.id}
            }
        });

        if (!getOTP) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'This otp has invalid.',
                code: 400,
            });
        }

        const todate = new Date();
        const expireDate = new Date(getOTP.expiration);

        if(expireDate <= todate) {
            throw new HttpError({
                title: 'otp_expired',
                detail: 'The OTP code has expired. Please re-send the verification OTP to try again',
                code: 400,
            });
        }
        await userRepository.update(user.id, {
            is_email_verified: true, 
            status: Status.ACTIVE
        });
        await otpRepository.delete(getOTP.id);
        return jsonOne<string>(res, 200, 'Email verification successfull.');
    } catch (err) {
        next(err);
    }
};

// Update auth profile update
const userProfileUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authID = req['authentication']?.id;
        const { name } = req.body;
        // User Repository
        const userRepository = AppDataSource.getRepository(User);
        //Find user
        const user = await userRepository.findOne({where: { id: authID }});

        if (!user) {
            throw new HttpError({
                title: 'not_found',
                detail: 'The request data not found',
                code: 404,
            });
        }

        await userRepository.update(user?.id, {
            name: name
        });

        return jsonOne<string>(res, 200, 'The update request updated has been successfully.');
    } catch (err) {
        next(err);
    }
};

export default { registration, verification, userProfileUpdate };
