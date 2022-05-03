import express from 'express';
import fixturesController from '../controllers/fixtureController.js';

const routes = (fixture) => {
  const fixtureRouter = express.Router();
  const controller = fixturesController(fixture);

  fixtureRouter.route('/retrieve').get(controller.retrieve);
  fixtureRouter.route('/get').get(controller.get);
  return fixtureRouter;
};

export default { routes };
