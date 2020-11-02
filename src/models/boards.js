module.exports = (sequelize, type) => {
	const Boards = sequelize.define('Boards', {
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
			allowNull: true,
		},
	});
	
	Boards.associate = function (models) {
		Boards.hasMany(models.Columns, {
			as: 'columns',
			onDelete: 'cascade',
		});
	};
	
	return Boards;
};