const express = require('express');
const tasksRouter = express.Router();
const tasksController = require('../controllers/tasks');

tasksRouter.post('', tasksController.create);
tasksRouter.put('/:id', tasksController.update);
tasksRouter.delete('/:id', tasksController.delete);

module.exports = tasksRouter;
