import { createAppFromEnv } from './bootstrap.js';
import { parseEnv } from './config/env.js';
import { createFileFeedbackStore } from './services/feedbackStore.js';

const env = parseEnv(process.env);
const app = createAppFromEnv(env, createFileFeedbackStore(env.FEEDBACK_FILE));

app.listen(env.PORT, (error) => {
  if (error) throw error;
  console.log(`API listening on port ${env.PORT}, allowing ${env.FRONTEND_ORIGIN}`);
});
