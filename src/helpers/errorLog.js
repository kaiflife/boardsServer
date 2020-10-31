module.exports = {
	errorLog(comment = 'SERVER ERROR', e) {
		console.error(comment, e, typeof e === 'object' && e.message);
	}
}