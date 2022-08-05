import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes';
import errorHandler from './middlewares/error-handler';

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res, next) => {
  req.user = {
    _id: '62ed77a0bee8136671644989'
  };

  next();
});

app.use('/', routes);

app.use((err: any, req: any, res: any, next: NextFunction) => errorHandler(err, req, res, next));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});