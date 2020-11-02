module.exports = (sequelize, type) => {
	const Tokens = sequelize.define('Tokens', {
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
	});
	
	Tokens.associate = function(models) {
		Tokens.belongsTo(models.Users), {
			as: 'tokens',
		}
	}
	
	return Tokens;
}
