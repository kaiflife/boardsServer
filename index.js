'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/src/config/config.js')[env];
const db = {};

let sequelize;
sequelize = new Sequelize(
  config.database, config.username, config.password,
  { host: config.host, dialect: config.dialect}
);


const modelsPath = `${__dirname}/src/models/`;

fs
  .readdirSync(modelsPath)
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.models.boards.hasMany(sequelize.models.columns, { onDelete: "cascade" });
sequelize.models.columns.hasMany(sequelize.models.tasks, { onDelete: "cascade" });

sequelize.sync()
  .then(() => console.log('succesfully sync'))
  .catch(e => console.error('error sync', e))

module.exports = db;
