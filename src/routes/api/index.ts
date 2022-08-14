import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Users from './users';
import Cards from './cards';
import { createUser, login } from '../../controllers/users';
import auth from '../../middlewares/auth';
import { urlValidationMethod } from '../../utils/validation';

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(urlValidationMethod),
  }).unknown(true),
}), createUser);

router.use(auth);

router.use('/users', Users);
router.use('/cards', Cards);

export default router;
