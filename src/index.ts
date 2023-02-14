import express from 'express';
import cors from './app/middlewares/cors';
import errorHandler from './app/middlewares/errorHandler';
import 'express-async-errors';

import routes from './routes';
import updateDatabaseName from './app/middlewares/updateDatabaseName';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors);
app.use(updateDatabaseName);
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
