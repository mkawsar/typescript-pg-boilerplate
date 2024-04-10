import { Router } from 'express';
import { UserController } from '../../controllers';
import auth from '../../middleware/auth.middleware';
import validate from '../../middleware/validation.middleware';
import { emailValidation, requiredTextField, password, roleValidation } from '../../validators/common.validator';
import permission from '../../middleware/permission.middleware';
import { Role } from '../../enums';


const _router = Router();

// registration
_router
    .route('/registration')
    .post(validate([
        emailValidation('email', 'email', {min: 3, max: 100}),
        requiredTextField('name', 'Name', { min: 2, max: 255 }),
        roleValidation('role'),
        password('password'),
        password('confirm_password')
    ]), UserController.registration);

_router
    .route('/account/verification')
    .post(validate([
        emailValidation('email', 'email', {min: 3, max: 100}),
        requiredTextField('otp', 'otp', { min: 2, max: 255 })
    ]), UserController.verification);

_router
    .route('/profile/update')
    .put(validate([
        requiredTextField('name', 'Name', { min: 2, max: 255 })
    ]), auth, UserController.userProfileUpdate);

_router
    .route('/list')
    .get(auth, permission([Role.ADMIN]), UserController.getUserList);

//EXPORT
export const router = _router;
