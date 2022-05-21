import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import Tweet from './models/tweetModel.js';
import User from './models/userModel.js';
import Fixtures from './models/fixtureModel.js';
import tweetRouter from './routes/tweetRouter.js';
import userRouter from './routes/userRouter.js';
import fixtureRouter from './routes/fixtureRouter.js';
import fixturesController from './controllers/fixtureController.js';

dotenv.config({ path: './.env' });
const app = express();
const { PORT } = process.env;
const tweetRoutes = tweetRouter.routes(Tweet);
const userRoutes = userRouter.routes(User);
const fixtureRoutes = fixtureRouter.routes(Fixtures);
const controller = fixturesController(Fixtures);
const corsOpts = {
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOpts));
app.use(express.json({ limit: '5000mb' }));
app.use(cookieParser());

const scheduler = new ToadScheduler();
const retrieveFixtures = new AsyncTask('retrieve fixtures', () => controller.retrieve(), (err) => { console.log(err); });
// eslint-disable-next-line max-len
const retrieveFixturesJob = new SimpleIntervalJob({ seconds: 3600, runImmediately: true }, retrieveFixtures);

mongoose.connect(process.env.CREDENTIALS);
mongoose.connection.once('open', () => {
  console.log('Connection to MongoDB established');
  scheduler.addSimpleIntervalJob(retrieveFixturesJob);
});
mongoose.connection.on('error', (e) => {
  console.log(`ERROR: ${e}`);
});

app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);
app.use('/fixtures', fixtureRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
