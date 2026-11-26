import express, { type Express } from 'express';
import { defaultConfig, type AppConfig } from './config/appConfig.js';
import { cors } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { createApiRouter, type AppDependencies } from './routes/index.js';

export function createApp(
  dependencies: AppDependencies,
  overrides: Partial<AppConfig> = {},
): Express {
  const config = { ...defaultConfig, ...overrides };
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxyHops);
  app.use(securityHeaders);
  app.use(cors(config.frontendOrigin));
  app.use(express.json({ limit: '10kb' }));
  // Someone opening the bare domain should see that the server is up.
  app.get('/', (_req, res) => {
    res.json({ message: 'FactCheckerBD API is running.', health: '/api/health' });
  });
  app.use('/api', createApiRouter(dependencies, config));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
