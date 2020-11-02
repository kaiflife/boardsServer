module.exports = (sequelize, type) => {
	return sequelize.define("Cards", {
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
	});
}