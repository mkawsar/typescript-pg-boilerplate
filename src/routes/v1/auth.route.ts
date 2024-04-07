import { Router } from 'express';
import auth from '../../middleware/auth.middleware';
import validate from '../../middleware/validation.middleware';
import AuthController from '../../controllers/auth.controller';
import { emailValidation, loginPasswordValidation } from '../../validators/common.validator';

const _router = Router();

_router
    .route('/login')
    .post(validate([
        emailValidation('email', 'email', {min: 3, max: 100}),
        loginPasswordValidation('password')
    ]), AuthController.login);

_router
    .route('/user')
    .get(auth, AuthController.getAuthUser);

_router
    .route('/logout')
    .delete(auth, AuthController.logout);

//EXPORT
export const router = _router;
