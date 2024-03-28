import { Router } from 'express';
import { Role } from '../../enums';
import { UserController } from '../../controllers';
import validate from '../../middleware/validation.middleware';

const _router = Router();

// registration
_router
    .route('/registrion')
    .post(UserController.registration);

//EXPORT
export const router = _router;
