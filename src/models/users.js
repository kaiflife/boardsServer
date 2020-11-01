module.exports = (sequelize, type) => {
	return sequelize.define('users', {
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
		accessTokenExpiredIn: {
			type: type.DATE,
			allowNull: true,
		},
		refreshTokenExpiredIn: {
			type: type.DATE,
			allowNull: true,
		},
	})
}
