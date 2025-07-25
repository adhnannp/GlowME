//server
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import app from './app';
import 'reflect-metadata'; 
import container from './di/container';
import { TYPES } from './di/types';
import { IUnbanUsersJob } from './core/interfaces/middlewares/IUnbanUserJob';
import { configureCloudinary } from './config/cloudinary';
import logger from './utils/logger';
import setUpSocket from './config/setUpSocket';
import { Server } from 'http';


dotenv.config();

logger.info('Server started');
logger.warn('This is a warning');
logger.error('This is an error');
logger.verbose('App is preparing');
logger.debug('Debug info here'); 

connectDB();
connectRedis();
configureCloudinary();
const unbanJob = container.get<IUnbanUsersJob>(TYPES.UnbanUsersJob);
unbanJob.start();

const server = new Server(app)
const io = setUpSocket(server)

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});