import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import { NOT_FOUND_CARD_ERROR_TEXT } from '../consts';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.deleteOne({_id: req.params.cardId})
    .orFail(new NotFoundError(NOT_FOUND_CARD_ERROR_TEXT))
    .then((data) => {
      res.send({ data: data });
    })
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction) => {
  const card = req.body;

  Card.create({ ...card, owner: req.user })
    .then((newCard) => res.send({ data: newCard }))
    .catch(next);
};

export const likeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((newCard) => res.send({ data: newCard }))
  .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((newCard) => res.send({ data: newCard }))
  .catch(next);
}