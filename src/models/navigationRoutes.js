module.exports = (sequelize, type) => {
	return sequelize.define('NavigationRoutes', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: type.INTEGER,
		},
		name: {
			allowNull: false,
			type: type.STRING,
		},
		params: {
			allowNull: false,
			type: type.ARRAY(type.STRING),
		},
		createdAt: {
			allowNull: false,
			type: type.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: type.DATE,
		},
		deletedAt: {
			type: type.DATE,
		},
	});
}
