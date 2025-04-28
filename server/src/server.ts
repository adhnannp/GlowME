//server
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import app from './app';
import "reflect-metadata"; 
import container from './di/container';
import { TYPES } from './di/types';
import { IUnbanUsersJob } from './core/interfaces/middlewares/IUnbanUserJob';
import { configureCloudinary } from "./config/cloudinary";

dotenv.config();

connectDB();
connectRedis();
configureCloudinary();
const unbanJob = container.get<IUnbanUsersJob>(TYPES.UnbanUsersJob);
unbanJob.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});