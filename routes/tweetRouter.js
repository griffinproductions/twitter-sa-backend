import express from 'express';
import tweetController from '../controllers/tweetController.js';

const routes = (Tweet) => {
  const tweetRouter = express.Router();
  const controller = tweetController(Tweet);

  tweetRouter.route('/add').post(controller.push);
  tweetRouter.route('/all').get(controller.get);
  tweetRouter.route('/get/:query').get(controller.fetchAll);
  tweetRouter.route('/process').get(controller.processTest);
  return tweetRouter;
};

export default { routes };
