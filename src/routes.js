import express from 'express';
import { authMiddleware } from './auth/authMiddleware.js';
import { AuthController } from './auth/AuthController.js';
import { PlantController } from './plant/PlantController.js';
import { getPlantImageUploadLink } from './upload/getPlantImageUploadLink.js';
import { UserController } from './user/UserController.js';

export const routes = express.Router();

routes.get('/plants', PlantController.getAllPlants);
routes.get('/plant/:id', PlantController.getPlant);
routes.post('/plant', authMiddleware, PlantController.createPlant);

routes.post('/plantImageUploadLink', authMiddleware, getPlantImageUploadLink);
routes.post('/confirmplantsending', authMiddleware, PlantController.confirmPlantSending);

routes.post('/googlesignin', AuthController.authenticateWithGoogle);

routes.get('/user/:id', UserController.getUser);
routes.get('/userplants/:id', UserController.getUserPlants);
