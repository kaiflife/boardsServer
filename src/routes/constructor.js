const express = require('express');
const constructorRouter = express.Router();
const constructorController = require('../controllers/constructor');
const { validateToken } = require('../helpers/validator');

constructorRouter.get('/editor', validateToken, constructorController.enterConstructor);
constructorRouter.post('/register-constructor', validateToken, constructorController.enterConstructor);
constructorRouter.get('/navigation-routes', constructorController.navigationRoutes);
constructorRouter.get('/init-js-file', constructorController.initJsFile);

module.exports = constructorRouter;
