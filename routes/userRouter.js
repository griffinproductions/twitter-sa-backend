import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../middleware/auth.js';

const routes = (User) => {
  const userRouter = express.Router();
  const controller = userController(User);
  const authenticationController = authController();

  userRouter.route('/register').post(controller.register);
  userRouter.route('/login').post(controller.login);
  userRouter.route('/logout').get(controller.logout);
  userRouter.route('/session').get(authenticationController.auth, controller.session);
  userRouter.route('/key').get([authenticationController.auth, authenticationController.permissions], controller.getKey);
  userRouter.route('/update/favorites').put(authenticationController.auth, controller.updateFavorites);
  return userRouter;
};

export default { routes };
