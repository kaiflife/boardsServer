const express = require('express');
const tasksRouter = express.Router();
const tasksController = require('../models/tasks');

tasksRouter.post('', tasksController.create);
tasksRouter.put('/:id', tasksController.update);
tasksRouter.delete('/:id', tasksController.delete);
tasksRouter.get('/:id', tasksController.getTask);

module.exports = tasksRouter;
