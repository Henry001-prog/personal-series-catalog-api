import { Router } from 'express';
import { Request, Response, NextFunction } from "express";
import SeriesController from './controllers/SeriesController';
import { AuthService } from './controllers/AuthService';
import { auth } from './config/auth';
import multer from 'multer';
import { multerConfig } from './config/multer';
import { Image } from './models/Image';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
    file: any;
}

const routes = Router();

const protectedApi = Router();
protectedApi.use(auth);

routes.post('/api/series', protectedApi, SeriesController.createSeries);
routes.post('/api/img', upload.single('image'), SeriesController.createSeriesImage);
routes.get('/api/img/:key', SeriesController.showAllImages);
routes.get('/api/series/:uid', protectedApi, SeriesController.showAllSeries);
routes.get('/api/series/:uid/:id', protectedApi, SeriesController.showSeries);
routes.put('/api/series/:id', protectedApi, SeriesController.updateSeries);
routes.delete('/api/series/:id', protectedApi, SeriesController.deleteSeries);

routes.post('/oapi/login', AuthService.login);
routes.post('/oapi/signup', AuthService.signup);
routes.post('/oapi/validateToken', AuthService.validateToken);
routes.get('/oapi/verify/:email', AuthService.verifyUser);

export const routesApi = routes;