var express = require('express');
var boardRouter = express.Router();
const boardController = require('../models/boards');

/* GET users listing. */
boardRouter.post('/api/board/:id', boardController.create);
boardRouter.put('/api/board/:id', boardController.update);

module.exports = boardRouter;
