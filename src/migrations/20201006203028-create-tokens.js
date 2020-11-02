module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Tokens', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: type.INTEGER,
			},
			refreshToken: {
				type: type.STRING,
				allowNull: true,
			},
			accessToken: {
				type: type.STRING,
				allowNull: true,
			},
			accessTokenExpiredIn: {
				type: type.DATE,
				allowNull: true,
			},
			refreshTokenExpiredIn: {
				type: type.DATE,
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
		await queryInterface.dropTable('Tokens');
	},
};