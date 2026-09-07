import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
const allowedOrigins = env.CLIENT_URL.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(globalLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
