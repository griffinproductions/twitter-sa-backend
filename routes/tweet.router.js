const express = require('express');
const tweetController = require('../controllers/tweet.controller');

const routes = (Tweet) => {
  const tweetRouter = express.Router();
  const controller = tweetController(Tweet);

  tweetRouter.route('/add').post(controller.push);
  tweetRouter.route('/all').get(controller.get);
  return tweetRouter;
};

module.exports = routes;
