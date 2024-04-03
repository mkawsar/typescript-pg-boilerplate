import { Router } from 'express';
import { UserController } from '../../controllers';
import validate from '../../middleware/validation.middleware';
import { emailValidation, requiredTextField, password, roleValidation } from '../../validators/common.validator';


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

//EXPORT
export const router = _router;
