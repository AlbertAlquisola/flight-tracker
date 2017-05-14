import apiRoutes from './api';
import authRoutes from './auth';
import userRoutes from './user';

export default (app, mw, passport) => {
  const routes = {
    apiRouter: apiRoutes(app, mw),
    authRouter: authRoutes(app, passport),
    userRouter: userRoutes(app, mw),
  };

  return routes;
};