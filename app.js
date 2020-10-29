import UsersTable from "./models/users";
import TasksTable from "./models/tasks";
import BoardsTable from "./models/boards";
import ColumnsTable from "./models/columns";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const boardsRouter = require('./routes/boards');
const columnsRouter = require('./routes/columns');
const tasksRouter = require('./routes/tasks');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_NAME,
 process.env.DB_PASSWORD,
 {
   dialect: process.env.SEQUELIZE_DIALECT,
   host: process.env.HOST,
 }
);

export const Users = sequelize.define("users", UsersTable);
export const Boards = sequelize.define("boards", BoardsTable);
export const Columns = sequelize.define("columns", ColumnsTable);
export const Tasks = sequelize.define("tasks", TasksTable);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/boards', boardsRouter);
app.use('/columns', boardsRouter);
app.use('/tasks', tasksRouter);

sequelize.sync().then( result => {
 if(result) {
  app.listen(process.env.PORT || 3000);
 }
})
 .catch(err=> console.error(err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
