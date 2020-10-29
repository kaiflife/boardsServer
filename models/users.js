const { DataTypes } = require('sequelize');
export const UsersTable = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	surname: {
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
		type: DataTypes.BOOL,
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