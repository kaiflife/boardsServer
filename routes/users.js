var express = require('express');
var userRouter = express.Router();
const userController = require('../controllers/users');

userRouter.post('/api/auth', userController.auth);
userRouter.post('/api/register', userController.registration);
userRouter.get('/api/:id', userController.getUser);
userRouter.put('/api/:id', userController.update);
userRouter.delete('/api/:id', userController.delete);

module.exports = userRouter;
