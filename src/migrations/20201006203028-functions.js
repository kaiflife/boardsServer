module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Functions', {
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
			arguments: {
				allowNull: true,
				type: type.ARRAY(type.JSON)
			},
			body: {
				allowNull: false,
				type: type.JSON
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
		await queryInterface.dropTable('Functions');
	},
};