import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../../controllers/cards';

const urlValidationMethod = (value: string) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidationMethod),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
}), dislikeCard);

export default router;
