import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import Tweet from './models/tweetModel.js';
import User from './models/userModel.js';
import tweetRouter from './routes/tweetRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config({ path: './.env' });
const app = express();
const PORT = 81 || process.env.PORT;
const tweetRoutes = tweetRouter.routes(Tweet);
const userRoutes = userRouter.routes(User);
const corsOpts = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOpts));
app.use(express.json({ limit: '5000mb' }));
app.use(cookieParser());

mongoose.connect(process.env.CREDENTIALS);
mongoose.connection.once('open', () => {
  console.log('Connection to MongoDB established');
});
mongoose.connection.on('error', (e) => {
  console.log(`ERROR: ${e}`);
});

app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
