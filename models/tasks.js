const { DataTypes } = require('sequelize');

const TasksTable = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	}
};

export default TasksTable;