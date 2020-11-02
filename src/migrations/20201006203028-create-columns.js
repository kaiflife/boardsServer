module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Columns', {
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
			authorId: {
				type: type.INTEGER,
				allowNull: false,
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
		await queryInterface.dropTable('Columns');
	},
};