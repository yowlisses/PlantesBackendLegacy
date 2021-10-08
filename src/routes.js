import express from 'express';
import { authMiddleware } from './auth/authMiddleware.js';
import { getPlantImageUploadLink } from './upload/getPlantImageUploadLink.js';

import { PingController } from './ping/PingController.js';

import { getPlant } from './plant/getPlant.js';
import { getPlants } from './plant/getPlants.js';
import { createPlant } from './plant/createPlant.js';
import { confirmPlantSending } from './plant/confirmPlantSending.js';

import { authenticateWithGoogle } from './auth/authenticateWithGoogle.js';

import { getUser } from './user/getUser.js';
import { removePlant } from './plant/removePlant.js';
import { getUserPlants } from './user/getUserPlants.js';
import { updateProfile } from './user/updateProfile.js';
import { getNearPlants } from './plant/getNearPlants.js';
import { updateUserLocationByIp } from './geolocation/updateUserLocationByIp.js';
import { updateUserLocationByCoordinates } from './geolocation/updateUserLocationByCoordinates.js';

export const routes = express.Router();

routes.get('/ping', PingController.ping);

routes.get('/get-near-plants', getNearPlants);

routes.get('/plant/:id', getPlant);
routes.post('/plants/:page', getPlants);
routes.delete('/plant/:id', removePlant);
// routes.get('/search/:text?', searchPlant);
routes.post('/plant', authMiddleware, createPlant);
routes.post('/confirm-plant-sending', authMiddleware, confirmPlantSending);
routes.post('/plant-image-upload-link', authMiddleware, getPlantImageUploadLink);

routes.post('/google-sign-in', authenticateWithGoogle);

routes.get('/user/:id', getUser);
routes.get('/user-plants/:id', getUserPlants);
routes.put('/update-profile', authMiddleware, updateProfile);
routes.put('/update-location-by-ip', authMiddleware, updateUserLocationByIp);
routes.put('/update-location-by-coordinates', authMiddleware, updateUserLocationByCoordinates);
