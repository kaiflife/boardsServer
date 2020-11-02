module.exports = (sequelize, type) => {
	return sequelize.define('tokens', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		refreshToken: {
			type: type.STRING,
			allowNull: true,
		},
		accessToken: {
			type: type.STRING,
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
