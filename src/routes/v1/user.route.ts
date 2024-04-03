import { Router } from 'express';
import { Role } from '../../enums';
import { UserController } from '../../controllers';
import validate from '../../middleware/validation.middleware';
import permission from '../../middleware/permission.middleware';
import { authorization, emailValidation, requiredTextField, password } from '../../validators/common.validator';


const _router = Router();

// registration
_router
    .route('/registration')
    .post(validate([
        emailValidation('email', 'email', {min: 3, max: 100}),
        requiredTextField('name', 'Name', { min: 2, max: 255 }),
    ]), UserController.registration);

//EXPORT
export const router = _router;
