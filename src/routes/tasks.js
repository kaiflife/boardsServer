const express = require('express');
const tasksRouter = express.Router();
const tasksController = require('../controllers/tasks');
const { validateToken } = require('../helpers/validator');

tasksRouter.post('', validateToken, tasksController.create);
tasksRouter.put('/:id', validateToken, tasksController.update);
tasksRouter.delete('/:id', validateToken, tasksController.delete);

module.exports = tasksRouter;
