const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const constructorRouter = require('./routes/constructor');
const boardsRouter = require('./routes/boards');
const columnsRouter = require('./routes/columns');
const tasksRouter = require('./routes/tasks');


app.use('/users', usersRouter);
app.use('/constructor', constructorRouter);
app.use('/boards', boardsRouter);
app.use('/columns', columnsRouter);
app.use('/tasks', tasksRouter);

module.exports = app;