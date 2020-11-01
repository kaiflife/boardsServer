const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/auth', userController.auth);
userRouter.post('/registration', userController.registration);
userRouter.post('/logout', userController.logout);
userRouter.get('/', userController.getUser);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);
userRouter.post('/invite/?id', userController.invite);
userRouter.get('/refreshToken', userController.refreshToken);
userRouter.delete('/invite/?id', userController.removeFromBoard);

module.exports = userRouter;
