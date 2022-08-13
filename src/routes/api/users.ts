import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import { Router } from 'express';
import {
  getUser, getUsers, getMe, updateUser, updateAvatar,
} from '../../controllers/users';

const urlValidationMethod = (value: string) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
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
