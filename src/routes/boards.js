const express = require('express');
const boardRouter = express.Router();
const boardController = require('../controllers/boards');

/* GET users listing. */
boardRouter.post('', boardController.create);
boardRouter.put('/:id', boardController.update);
boardRouter.delete('/:id', boardController.delete);
boardRouter.get('/:id', boardController.getBoard);

module.exports = boardRouter;
