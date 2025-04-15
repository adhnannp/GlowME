//server
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import app from './app';

import "reflect-metadata"; 
import container from './di/container';
import { TYPES } from './di/types';
import { IUnbanUsersJob } from './core/interfaces/middlewares/IUnbanUserJob';

dotenv.config();

connectDB();
connectRedis();
const unbanJob = container.get<IUnbanUsersJob>(TYPES.UnbanUsersJob);
unbanJob.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});