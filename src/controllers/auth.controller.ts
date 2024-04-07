import { compare } from 'bcrypt';
import { jsonOne } from '../utils/general';
import HttpError from '../utils/http.error';
import { User } from '../entity/User.entity';
import { IAuth, IUser } from '../interfaces';
import { AppDataSource } from '../data-source';
import { matchedData } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { generateJWT, logoutGenerateJWT } from '../utils';

// Generate access token
const generateAccessToken = async (user: User) => {
    const token = generateJWT(
        {
            id: user?.id,
            role: user?.role,
            token: 'access'
        },
        {
            issuer: user?.email,
            subject: user?.email,
            audience: 'root'
        }
    );
    return { token: token };
};

const logoutgenerateAccessToken = async (user: User) => {
    const token = logoutGenerateJWT(
        {
            id: user?.id,
            role: user?.role,
            token: 'access'
        },
        {
            issuer: user?.email,
            subject: user?.email,
            audience: 'root'
        }
    );
    return { token: token };
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<IAuth> => {
    try {
        let payload = matchedData(req, {
            includeOptionals: true,
            locations: ['body']
        });

        const { email, password } = payload;

        // Get user information
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { email: email }
        });
        if (!user) {
            throw new HttpError({
                title: 'not_found',
                detail: 'The request data not found',
                code: 404,
            });
        }

        //Password compare
        const isValidPassword = await compare(String(password), String(user.password));
        //CHECK FOR USER VERIFIED AND EXISTING
        if (!user.is_email_verified) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        } else if (!user && !isValidPassword) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }

        // Get access token
        const accesstoken = await generateAccessToken(user);
        await userRepository.update(user?.id, {
            last_login: new Date(),
            online: true
        });

        const online = await userRepository.findOne({
            where: { id: user?.id }
        });

        const response = { user: online, token: accesstoken.token };

        return jsonOne<IAuth>(res, 200, response);
    } catch (err) {
        next(err);
    }
};

const getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: {id: req['authentication']?.id}
    });
    return jsonOne<IUser>(res, 200, user);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: {id: req['authentication']?.id}
    });
    await userRepository.update(user?.id, {
        online: false
    });
    const accesstoken = await logoutgenerateAccessToken(user);
    const response = { token: accesstoken.token };

    return jsonOne<any>(res, 200, response);
};

export default { login, getAuthUser, logout };
