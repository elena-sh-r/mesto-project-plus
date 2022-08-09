import { Router } from 'express';
import api from './api';
import NotFoundError from '../errors/not-found-error';
import { NOT_FOUND_ERROR_TEXT } from '../consts';

const router = Router();

router.use('/api', api);

router.all('*', () => {
  throw new NotFoundError(NOT_FOUND_ERROR_TEXT);
});

export default router;
