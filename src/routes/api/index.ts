import { Router } from 'express';
import Users from './users'
import Cards from './cards'

const router = Router();

router.use('/users', Users);
router.use('/cards', Cards);

export default router;