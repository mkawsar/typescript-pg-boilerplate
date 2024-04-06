import { Router } from 'express';
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

//EXPORT
export const router = _router;
