const { DataTypes } = require('sequelize');

const BoardsTable = {
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
	owners: {
		type: DataTypes.ARRAY,
		allowNull: false
	},
	participants: {
		type: DataTypes.ARRAY,
		allowNull: false,
	},
	tasksIds: {
		type: DataTypes.ARRAY,
		allowNull: false
	},
};

export default BoardsTable;