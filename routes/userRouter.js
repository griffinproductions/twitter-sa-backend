import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const routes = (User) => {
  const userRouter = express.Router();
  const controller = userController(User);

  userRouter.route('/register').post(controller.register);
  userRouter.route('/login').post(controller.login);
  userRouter.route('/logout').get(controller.logout);
  userRouter.route('/session').get(auth, controller.session);
  return userRouter;
};

export default { routes };
