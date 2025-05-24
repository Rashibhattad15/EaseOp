import { Router } from 'express';
import { registerUser, deleteUser, editUser, getUser } from '../controllers/authController';

const router = Router();

router.get('/users', getUser)
router.post('/register', registerUser);
router.delete('/:uid', deleteUser);
router.put('/:uid', editUser);

export default router;
