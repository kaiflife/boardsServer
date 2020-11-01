const jwt = require('jsonwebtoken');
const { users: Users } = require('../../index');
const {SOMETHING_WENT_WRONG, EXPIRED_TOKEN, INVALID_TOKEN} = require('../constants/responseStrings');
const {sendStatusData} = require('../helpers/sendStatusData');

//(?=.*\d)          // should contain at least one digit
//     (?=.*[a-z])       // should contain at least one lower case
//     (?=.*[A-Z])       // should contain at least one upper case
//     [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
//     $/

module.exports = {
  validatePassword(password){
    const regular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    return regular.test(password);
  },
  
  validateFullName(fullName){
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/
    return regName.test(fullName);
  },
  
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  
  async validateToken(req, res, next) {
    const token = req.headers.authorization;
    console.log(req);
    const isRefreshToken = req.url.includes('refreshToken');
    const userId = jwt.verify(
      token.split(' ')[1],
      process.env.AUTH_TOKEN,
      (err, payload) => {
        if (err) return { err };
        return { payload };
      }
    );
    try {
      const user = await Users.findOne({where: {id: userId}});
      const typeTokens = ['accessTokenExpiredIn', 'refreshTokenExpiredIn', ];
      let result;
      typeTokens.forEach(typeToken => {
        if(user[typeToken] - new Date() <= 0) {
          result = typeToken;
        }
      });
      if(result === 'accessTokenExpiredIn' && !isRefreshToken) {
        sendStatusData(res, 401, EXPIRED_TOKEN);
        return;
      }
      if(result === 'refreshTokenExpiredIn') {
        sendStatusData(res, 401, EXPIRED_TOKEN);
        return;
      }
      req.locals.userId = userId;
      next();
    } catch (e) {
      sendStatusData(res, 500, SOMETHING_WENT_WRONG);
      return;
    }
  },
}

// if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
//     if(userId === EXPIRED_TOKEN) return sendStatusData(res, 402, EXPIRED_TOKEN);