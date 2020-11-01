const express = require('express');
const boardRouter = express.Router();
const boardController = require('../controllers/boards');
const { validateToken } = require('../helpers/validator');

boardRouter.post('', validateToken, boardController.create);
boardRouter.put('/:id', validateToken, boardController.update);
boardRouter.delete('/:id', validateToken, boardController.delete);
boardRouter.get('/', validateToken, boardController.getBoards);

module.exports = boardRouter;
