import UsersModel from "./models/users";
import BoardsModal from "./models/boards";
import ColumnsModal from "./models/columns";
import TasksModal from "./models/tasks";
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_NAME,
		process.env.DB_PASSWORD,
	{
		dialect: process.env.SEQUELIZE_DIALECT,
		host: process.env.HOST,
	});

const Users = UsersModel(sequelize, Sequelize);
const Boards = BoardsModal(sequelize, Sequelize);
const Columns = ColumnsModal(sequelize, Sequelize);
const Tasks = TasksModal(sequelize, Sequelize);

Boards.hasMany(Columns, { onDelete: "cascade" });
Columns.hasMany(Tasks, { onDelete: "cascade" });

sequelize.sync({ force: true })
.then(() => {
	console.log(`Database & tables created!`)
});

module.exports = {
	Users,
	Boards,
	Columns,
	Tasks,
}