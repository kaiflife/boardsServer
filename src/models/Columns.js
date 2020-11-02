module.exports = (sequelize, type) => {
	return sequelize.define('columns', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		title: {
			type: type.STRING,
			allowNull: false
		},
		authorId: {
			type: type.INTEGER,
			allowNull: false,
		},
	})
}