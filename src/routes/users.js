const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users');
const { validateToken } = require('../helpers/validator');

userRouter.post('/auth', userController.auth);
userRouter.post('/registration', userController.registration);
userRouter.post('/logout', validateToken, userController.logout);
userRouter.get('/', validateToken, userController.getUser);
userRouter.put('/:id', validateToken, userController.update);
userRouter.delete('/:id', validateToken, userController.delete);
userRouter.post('/invite/?id', validateToken, userController.invite);
userRouter.post('/refreshToken', validateToken, userController.refreshToken);
userRouter.delete('/invite/?id', validateToken, userController.removeFromBoard);

module.exports = userRouter;
