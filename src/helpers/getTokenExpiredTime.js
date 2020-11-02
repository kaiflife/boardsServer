module.exports = {
	getTokenExpiredTime(minutes) {
		return new Date().getMinutes()+minutes;
	}
}