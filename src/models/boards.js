module.exports = (sequelize, type) => {
	return sequelize.define('boards', {
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
		ownersId: {
			type: type.ARRAY(type.INTEGER),
			allowNull: false
		},
		participantsId: {
			type: type.ARRAY(type.INTEGER),
			allowNull: false,
		},
	})
}
