import { extractToken } from '../utils';
import { User } from '../entity/User.entity';
import { AppDataSource } from '../data-source';
import { body, header } from 'express-validator';

//TEXT FIELD VALIDATOR FUNCTION
const requiredTextField = (field: string, message: string, options: { min: number; max: number }) => {
    return body(field)
        .trim()
        .exists()
        .notEmpty()
        .withMessage(`The ${message} is required`)
        .isString()
        .bail()
        .isLength({
            min: options.min,
            max: options.max,
        })
        .withMessage(`${message} must be between ${options.min} and ${options.max} characters`)
        ;
};

const emailValidation = (field: string, message: string, options: { min: number; max: number }) => {
    return body(field)
        .trim()
        .exists()
        .notEmpty()
        .withMessage(`The ${message} is required`)
        .isString()
        .bail()
        .isLength({
            min: options.min,
            max: options.max,
        })
        .withMessage(`${message} must be between ${options.min} and ${options.max} characters`)
        .bail()
        .isEmail()
        .withMessage('Email address is not valid')
        .customSanitizer((email) => {
            return email.toLowerCase();
        });
};

const loginPasswordValidation = () => {
    return body('password')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Password address is required')
        .isString()
        .isLength({
            max: 255,
        })
        .withMessage('Password is not valid');
};

const password = (field: any) => {
    return body(field)
        .trim()
        .escape()
        .isString()
        .isLength({ min: 6 })
        .withMessage(
            `${
                field === 'password' ? 'Password' : 'Confirm password'
            } should not be empty and at a minimum six characters.`
        )
        .bail()
        .custom((value, { req }) => {
            if (field === 'confirm_password' && value !== req.body.password) {
                throw new Error(
                    'Password confirmation does not match password'
                );
            }
            return true;
        });
};

// AUTHORIZATION HEADER VALIDATOR FUNCTION
const authorization = () => {
    return header('authorization')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Missing authentication header')
        .bail()
        .customSanitizer((token, { location }) => {
            if (location === 'headers') {
                return extractToken(token);
            }
        })
        .isJWT()
        .withMessage(
            'Invalid Authorization header, must be Bearer authorization'
        );
};

// Unique eamil validation
const uniqueEmailValidation = (field: string, message: string, options: { min: number; max: number }) => {
    return body(field)
        .trim()
        .exists()
        .notEmpty()
        .withMessage(`The ${message} is required`)
        .isString()
        .bail()
        .isLength({
            min: options.min,
            max: options.max,
        })
        .withMessage(`${message} must be between ${options.min} and ${options.max} characters`)
        .bail()
        .isEmail()
        .withMessage('Email address is not valid')
        .custom(async value => {
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.findOne({ where: { email: value } });
            return await Promise.reject('The email has already been taken.');
        })
        .customSanitizer((email) => {
            return email.toLowerCase();
        });
};

//EXPORT
export { authorization, emailValidation, loginPasswordValidation, password, requiredTextField, uniqueEmailValidation };
