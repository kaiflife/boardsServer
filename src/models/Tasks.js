module.exports = (sequelize, type) => {
	return sequelize.define("tasks", {
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
		text: {
			type: type.STRING,
			allowNull: true,
		},
		authorId: {
			type: type.INTEGER,
			allowNull: false,
		},
	})
}