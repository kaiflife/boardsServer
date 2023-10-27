const {errorLog} = require("../helpers/errorLog");
const {
  INVALID_PASSWORD,
  USER_NOT_FOUND,
} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { NavigationRoutes, Functions, Users } = require('../../index');

module.exports = {
  // todo register first constructor owner (admin)
  async registerConstructor(req, res) {},

  async navigationRoutes(req, res) {
    try {
      const functions = await Functions.findAll()
      const navigationRoutes = await NavigationRoutes.findAll()

      return sendStatusData(res, 200, {
        functions,
        navigationRoutes
      })
    } catch (e) {
      console.error(e)
    }
  },
  async enterConstructor(req, res) {

  },
  async createNewElement(req, res) {
    const { email, password } = req.body;
    try {
      const userDB = await Users.findOne({where: {email}, include: {model: Tokens, as: 'tokens'}});
      if(!userDB) {
        return sendStatusData(res, 404, USER_NOT_FOUND);
      }
      const { dataValues: user, tokens } = userDB;
      const token = tokens[0];

      if(user.password !== password) {
        return sendStatusData(res, 401, INVALID_PASSWORD);
      }
  
      const userData = createToken(user);
      
      const refreshTokenExpiredIn = getTokenExpiredTime(120);
      const accessTokenExpiredIn = getTokenExpiredTime(2);
      
      const {accessToken, refreshToken} = userData;
      
      await token.update({
        accessToken,
        refreshToken,
        refreshTokenExpiredIn,
        accessTokenExpiredIn,
      });
      return sendStatusData(res, 200, userData);
      
    } catch(e) {
      errorLog('auth User', e);
      return sendStatusData(res, 500);
    }
  },
}