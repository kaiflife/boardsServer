const { SOMETHING_WENT_WRONG } = require('../constants/responseStrings');
module.exports = {
	sendStatusData(res, status, data = 'OK'){
		const mainData = status !== 200 && data === 'OK' ? SOMETHING_WENT_WRONG : data;
		return res.status(status).json(mainData);
	}
}