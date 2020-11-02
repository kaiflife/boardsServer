module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Boards', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: type.INTEGER,
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
				allowNull: true,
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
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('Boards');
	},
};