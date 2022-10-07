import { Router } from 'express';
import SeriesController from './controllers/SeriesController';
import { AuthService } from './controllers/AuthService';
import { auth } from './config/auth';

const routes = Router();

const protectedApi = Router();
protectedApi.use(auth);

routes.post('/api/series', protectedApi, SeriesController.createSeries);
routes.get('/api/series', protectedApi, SeriesController.showAllSeries);
routes.get('/api/series/:id', protectedApi, SeriesController.showSeries);
routes.put('/api/series/:id', protectedApi, SeriesController.updateSeries);
routes.delete('/api/series/:id', protectedApi, SeriesController.deleteSeries);

routes.post('/oapi/login', AuthService.login);
routes.post('/oapi/signup', AuthService.signup);
routes.post('/oapi/validateToken', AuthService.validateToken);

export const routesApi = routes;