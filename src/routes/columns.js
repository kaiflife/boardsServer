var express = require('express');
const columnsRouter = express.Router();
const columnsController = require('../controllers/columns');

columnsRouter.post('', columnsController.create);
columnsRouter.get('', columnsController.getColumnsBoard)
columnsRouter.put('/:id', columnsController.update);
columnsRouter.delete('/:id', columnsController.delete);

module.exports = columnsRouter;
