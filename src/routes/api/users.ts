import { getUser, getUsers, createUser, updateUser, updateAvatar } from '../../controllers/users';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;