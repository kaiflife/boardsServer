const { DataTypes } = require('sequelize');
const UsersTable = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	invites: {
		type: DataTypes.ARRAY,
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	verified: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	verificationCode: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	boardIds: {
		type: DataTypes.ARRAY,
		allowNull: false,
	}
};

export default UsersTable;