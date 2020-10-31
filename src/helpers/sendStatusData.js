module.exports = {
	sendStatusData(res, status, data){
		if(data) {
			return res.status(status).json(data);
		}
		return res.status(status);
	}
}