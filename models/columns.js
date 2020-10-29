const { DataTypes } = require('sequelize');

const ColumnsTable = {
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
	tasksIds: {
		type: DataTypes.ARRAY,
		allowNull: false
	},
};

export default ColumnsTable;