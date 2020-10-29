var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/auth', userController.auth);
userRouter.post('/registration', userController.registration);
userRouter.get('/:id', userController.getUser);
userRouter.get('', userController.getUsersBoard);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

module.exports = userRouter;
