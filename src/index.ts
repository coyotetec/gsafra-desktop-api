import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './app/middlewares/errorHandler';
import 'express-async-errors';
import 'dotenv/config';

import routes from './routes';
import updateDatabaseName from './app/middlewares/updateDatabaseName';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(
  morgan(
    ':date[iso] - :req[x-id-empresa] - :method :status :url :response-time ms',
  ),
);
app.use(express.json());
app.use(updateDatabaseName);
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
