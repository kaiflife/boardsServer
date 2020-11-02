const jwt = require('jsonwebtoken');
const { Users, Tokens } = require('../../index');
const {INVALID_TOKEN, USER_NOT_FOUND, ERROR_VALIDATE_TOKEN, EXPIRED_TOKEN} = require('../constants/responseStrings');
const {sendStatusData} = require('../helpers/sendStatusData');

//(?=.*\d)          // should contain at least one digit
//     (?=.*[a-z])       // should contain at least one lower case
//     (?=.*[A-Z])       // should contain at least one upper case
//     [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
//     $/

const jwtVerify = (token) => jwt.verify(
  token,
  process.env.AUTH_TOKEN,
  (err, payload) => {
    if (err) {
      return { err };
    }
    return payload;
  }
);

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
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const isRefreshToken = req.baseUrl.includes('refreshToken');
    const {id: userId} = jwtVerify(token);
    
    if(!userId && !isRefreshToken) return sendStatusData(res, 400, EXPIRED_TOKEN);
    
    try {
      const {dataValues: user, tokens: tokensEntity} = await Users.findOne({where: {id: userId}, include: [{model: Tokens, as: 'tokens'}]});
      if(!user) return sendStatusData(res, 404, INVALID_TOKEN);
      
      const { dataValues: tokens} = tokensEntity[0];
  
      if(isRefreshToken) {
        const { refreshToken } = req.body;
        const isInvalidRefreshToken = refreshToken !== tokens.refreshToken;
        if(isInvalidRefreshToken) return sendStatusData(res, 404, INVALID_TOKEN);
        const { exp } = jwtVerify(refreshToken);
        if(!exp) return sendStatusData(res, 400, EXPIRED_TOKEN);
      } else {
        const isInvalidAccessToken = token !== tokens.accessToken;
        if(isInvalidAccessToken) return sendStatusData(res, 404, INVALID_TOKEN);
      }
      
      
      res.locals.userId = userId;
      next();
    } catch (e) {
      sendStatusData(res, 500, ERROR_VALIDATE_TOKEN);
      return console.error(e, e.message);
    }
  },
}

// if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
//     if(userId === EXPIRED_TOKEN) return sendStatusData(res, 402, EXPIRED_TOKEN);