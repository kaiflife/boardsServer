module.exports = (sequelize, type) => {
	const Columns = sequelize.define('Columns', {
		title: {
			type: type.STRING,
			allowNull: false
		},
		authorId: {
			type: type.INTEGER,
			allowNull: false,
		},
	});
	
	Columns.associate = function (models) {
		Columns.hasMany(models.Cards, {
			foreignKey: 'columnId',
			as: 'cards',
			onDelete: 'cascade',
		});
	};
	
	return Columns;
};