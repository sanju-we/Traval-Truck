import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { createApp } from './app';
import { logger } from './utils/logger';
import { container } from './core/DI/container';
import { SchedulerService } from './services/shared/scheduler.service';

dotenv.config();
const app = createApp();
const port = process.env.PORT || 5000;

connectDB().then(() => {
  const scheduler = container.get<SchedulerService>('SchedulerService');
  scheduler.start();
  app.listen(port, () => logger.info(`Server running on http://localhost:${port}`));
});
