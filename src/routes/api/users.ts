import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { urlValidationMethod } from '../../utils/validation';
import {
  getUser, getUsers, getMe, updateUser, updateAvatar,
} from '../../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
}), getUser);

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(urlValidationMethod),
  }).unknown(true),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidationMethod),
  }).unknown(true),
}), updateAvatar);

export default router;
