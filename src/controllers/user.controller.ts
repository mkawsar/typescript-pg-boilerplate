import { hash } from 'bcrypt';
import { IUser } from '../interfaces';
import { Otp } from '../entity/Otp.entity';
import HttpError from '../utils/http.error';
import { User } from '../entity/User.entity';
import { AppDataSource } from '../data-source';
import { Status, OtpType, Role } from '../enums';
import { verifyOtp, generateOTP } from '../utils';
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
        return jsonAll<any>(res, 200, existUser)
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
}

export default { registration };
