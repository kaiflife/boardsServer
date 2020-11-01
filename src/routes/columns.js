var express = require('express');
const columnsRouter = express.Router();
const columnsController = require('../controllers/columns');
const { validateToken } = require('../helpers/validator');

columnsRouter.post('', validateToken, columnsController.create);
columnsRouter.get('', validateToken, columnsController.getColumnsBoard)
columnsRouter.put('/:id', validateToken, columnsController.update);
columnsRouter.delete('/:id', validateToken, columnsController.delete);

module.exports = columnsRouter;
