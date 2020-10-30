var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/auth', userController.auth);
userRouter.post('/registration', userController.registration);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);
userRouter.post('/invite/?id', userController.invite);
userRouter.delete('/invite/?id', userController.removeFromBoard);

module.exports = userRouter;
