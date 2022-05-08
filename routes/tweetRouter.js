import express from 'express';
import tweetController from '../controllers/tweetController.js';
import authController from '../middleware/auth.js';

const routes = (Tweet) => {
  const tweetRouter = express.Router();
  const controller = tweetController(Tweet);
  const authenticationController = authController();

  tweetRouter.route('/add').post(controller.push);
  tweetRouter.route('/all').get(controller.get);
  tweetRouter.route('/get/:query').get(controller.fetchAll);
  tweetRouter.route('/process/raw').get(authenticationController.canUseAPI, controller.processTest);
  tweetRouter.route('/process/minutely').get(authenticationController.canUseAPI, controller.getSentimentPerMinute);
  tweetRouter.route('/process/words').get(authenticationController.canUseAPI, controller.getWordScores);
  tweetRouter.route('/process/label/all').get(authenticationController.canUseAPI, controller.getTweetLabelsAndPercentages);
  tweetRouter.route('/process/label/percent').get(authenticationController.canUseAPI, controller.getTweetPercentages);
  tweetRouter.route('/process/all').get(authenticationController.canUseAPI, controller.getAllData);
  tweetRouter.route('/search').get(authenticationController.canUseAPI, controller.search);
  return tweetRouter;
};

export default { routes };
