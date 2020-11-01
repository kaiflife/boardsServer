module.exports = {
	getTokenExpiredTime(minutes) {
		return new Date().setHours(this.getMinutes()+minutes);
	}
}