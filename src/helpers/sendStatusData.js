module.exports = {
	sendStatusData(res, status, data){
		if(data) {
			return res.send.status(status).json(data);
		}
		return res.send.status(status);
	}
}