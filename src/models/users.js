module.exports = (sequelize, type) => {
	const Users = sequelize.define('Users', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		firstName: {
			type: type.STRING,
			allowNull: false
		},
		invitesId: {
			type: type.ARRAY(type.INTEGER),
			allowNull: true,
		},
		lastName: {
			type: type.STRING,
			allowNull: false
		},
		email: {
			type: type.STRING,
			allowNull: false
		},
		password: {
			type: type.STRING,
			allowNull: false
		},
		boardsId: {
			type: type.ARRAY(type.INTEGER),
			allowNull: true,
		},
	});
	
	Users.associate = function (models) {
		Users.hasMany(models.Tokens, {
			as: 'tokens',
			onDelete: 'cascade',
		});
	}
	
	return Users;
}
