module.exports = {
	up: async (queryInterface, type) => {
		await queryInterface.createTable('Elements', {
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
			elementType: {
				allowNull: true,
				type: type.STRING,
			},
			type: {
				allowNull: false,
				type: type.STRING,
			},
			className: {
				allowNull: true,
				type: type.STRING
			},
			parentId: {
				allowNull: false,
				type: type.INTEGER
			},
			childrenIds: {
				allowNull: true,
				type: type.ARRAY(type.INTEGER)
			},
			nativeProps: {
				allowNull: true,
				type: type.JSON
			},
			dataAttributeProps: {
				allowNull: true,
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
		await queryInterface.dropTable('Elements');
	},
};