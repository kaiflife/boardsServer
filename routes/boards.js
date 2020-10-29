var express = require('express');
var boardRouter = express.Router();
const boardController = require('../models/boards');

/* GET users listing. */
boardRouter.post('', boardController.create);
boardRouter.get('', boardController.getBoardsUser)
boardRouter.put('/:id', boardController.update);
boardRouter.delete('/:id', boardController.delete);
boardRouter.get('/:id', boardController.getBoard);

module.exports = boardRouter;
