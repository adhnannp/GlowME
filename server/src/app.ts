// src/app.ts
import express from 'express';
import 'reflect-metadata';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import path from 'path';
import { requestLogger } from './middleware/Logger.Middleware';
import { errorLogger } from './middleware/Error.Middleware';
import { MESSAGES } from './utils/ResponseMessages';
import { STATUS_CODES } from './utils/HTTPStatusCode';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL!, 
  credentials: true,
}));
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/badges', express.static(path.join(__dirname, '../public/badges')));

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); 

app.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.ROUTE_NOT_FOUND });
});


app.use(errorLogger);

export default app;