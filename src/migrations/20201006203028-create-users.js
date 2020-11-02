module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: type.INTEGER,
			},
			firstName: {
				type: type.STRING,
				allowNull: false
			},
			invitesId: {
				type: type.ARRAY(type.INTEGER),
				allowNull: true,
			},
			lastName: {
				type: type.STRING,
				allowNull: false
			},
			email: {
				type: type.STRING,
				allowNull: false
			},
			password: {
				type: type.STRING,
				allowNull: false
			},
			boardsId: {
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
		await queryInterface.dropTable('Users');
	},
};