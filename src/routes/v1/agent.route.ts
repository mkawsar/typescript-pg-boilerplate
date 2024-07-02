import { Router } from 'express';
import { AgentController } from '../../controllers'
import auth from '../../middleware/auth.middleware';

const _router = Router();

_router
    .route('/list')
    .get(auth, AgentController.getAgentList);

//EXPORT
export const router = _router;
