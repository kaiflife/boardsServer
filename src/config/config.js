module.exports = {
	development: {
		username: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DIALECT,
	},
	test: {
		username: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DIALECT,
	},
	production: {
		username: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DIALECT,
	}
};