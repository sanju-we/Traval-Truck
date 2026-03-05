import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { createApp } from './app';
import { logger } from './utils/logger';
import { container } from './core/DI/container';
import { SchedulerService } from './services/shared/scheduler.service';

import http from 'http';
import { SocketService } from './services/shared/socket.service';

dotenv.config();
const app = createApp();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

connectDB().then(() => {
  const scheduler = container.get<SchedulerService>('SchedulerService');
  scheduler.start();

  const socketService = container.get<SocketService>('SocketService');
  socketService.init(server);

  server.listen(port, () => logger.info(`Server running on http://localhost:${port}`));
});
