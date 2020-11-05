const {validateEmail, validateFullName, validatePassword, validateToken} = require( "../helpers/validator");
const {errorLog} = require("../helpers/errorLog");
const { capitalizeFirstLetter } = require('../helpers/capitalizeFirstLetter');
const { getTokenExpiredTime } = require('../helpers/getTokenExpiredTime');
const jwt = require('jsonwebtoken');
const {
  BOARD_NOT_FOUND,
  EMAIL_EXISTS,
  EMAIL_INSTRUCTIONS,
  FULL_NAME_INSTRUCTIONS,
  INVALID_PASSWORD,
  PASSWORD_INSTRUCTIONS,
  SOMETHING_WENT_WRONG,
  USER_NOT_FOUND,
} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");

const { Tokens, Boards, Users } = require('../../index');

const generateToken = ({ user, expiresIn = '5m'}) => {
  const id = {id: user.id};
  return jwt.sign(id, process.env.AUTH_TOKEN, { expiresIn });
}

function createToken(user) {
  const accessToken = generateToken({user});
  const refreshToken = generateToken({user, expiresIn: '8h'});
  
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    accessToken,
    refreshToken,
  };
}

module.exports = {
  async auth(req, res) {
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
  
  async logout(req, res) {
    const { userId } = res.locals;
    try {
      const user = await Users.findOne({where: {id: userId}, include: [{model: Tokens, as: 'tokens'}]});
      if(!user) return sendStatusData(res, 404, USER_NOT_FOUND);
      
      await user.dataValues.tokens[0].update({
        accessToken: null,
        refreshToken: null,
        refreshTokenExpiredIn: null,
        accessTokenExpiredIn: null
      });
      return sendStatusData(res, 200);
    } catch (e) {
      return sendStatusData(res, 500);
    }
  },
    
  async update(req, res) {
    const { fullName, email, password } = req.body;
    
    if(!validatePassword(password)) {
      return sendStatusData(res, 400, PASSWORD_INSTRUCTIONS);
    }
    if(validateFullName(fullName)) {
      return sendStatusData(res, 400, FULL_NAME_INSTRUCTIONS);

    }
    if(validateEmail(email)) {
      return sendStatusData(res, 400, EMAIL_INSTRUCTIONS);
    }
    
    const [ firstName, lastName ] = fullName.split(' ' );
    
    const { userId } = res.locals;
    
    const updatedData = {};
    if(firstName) updatedData.firstName = firstName;
    if(lastName) updatedData.lastName = lastName;
    if(password) updatedData.password = password;
    if(email) updatedData.email = email;
    
    try {
      await Users.update(updatedData, {where: {userId}});
      sendStatusData(res, 200);
    } catch (e) {
      errorLog('update user', e);
      return sendStatusData(res, 500);
    }
  },
  
  async getUser(req, res) {
    const { userId } = res.locals;
    const { usersId } = req.query;
    if(usersId) {
      const users = await Users.findAll({where: {id: usersId}});
      return sendStatusData(res, 200, users);
    }
    const user = await Users.findByPk(userId);
    return sendStatusData(res, 200, user);
  },
  
  async invite(req, res) {
    const { invitedUserId, ownerId, boardId } = req.body;
    const newBoardUserId = ownerId || invitedUserId;
  
    const newBoardUser = await Users.findByPk(newBoardUserId);
    if(!newBoardUser) return sendStatusData(res, 404, USER_NOT_FOUND);
  
    const board = await Boards.findByPk(boardId);
    if(!board) return sendStatusData(res, 404, BOARD_NOT_FOUND);
    
    try {
      if(ownerId) {
        const invitesId = newBoardUser.dataValues.invitesId.filter(id => id !== newBoardUserId);
        const boardsId = [...newBoardUser.dataValues.boardsId, boardId];
    
        const participantsId = board.dataValues.participantsId.filter(id => id !== newBoardUserId);
        const ownersId = [...board.dataValues.participantsId, newBoardUserId];
    
        await Promise.all([
          newBoardUser.update({ invitesId, boardsId }),
          board.update({ participantsId, ownersId })
        ]);
      } else {
        const invitesId = [...newBoardUser.dataValues.invitesId, boardId];
        const boardsId = newBoardUser.dataValues.boardsId.filter(id => id !== boardId);
  
        const participantsId = [...board.dataValues.participantsId, newBoardUserId]
        const ownersId = board.dataValues.ownersId.filter(id => id !== newBoardUserId);
        
        await Promise.all([
          newBoardUser.update({ invitesId, boardsId }),
          board.update({ participantsId, ownersId })
        ]);
      }
      return sendStatusData(res, 200);
    } catch (e) {
      errorLog('make invite/owner', e);
      return sendStatusData(res, 500);
    }
  },
  
  async removeFromBoard(req, res) {
    const { targetUserId, boardId } = req.body;
    const targetUser = await Users.findByPk(targetUserId);
    if(!targetUser) return sendStatusData(res, 404, USER_NOT_FOUND);
    
    const board = await Boards.findByPk(boardId);
    if(!board) return sendStatusData(res, 404, BOARD_NOT_FOUND);

    const boardsId = targetUser.invitesId.filter(id => id !== boardId);
    const ownersId = board.participantsId.filter(id => id !== targetUserId);
    
    await Promise.all([
      targetUser.update({invitesId: boardsId, boardsId}),
      board.update({participantsId: ownersId, ownersId})
    ]);
    return sendStatusData(res, 200);
  },
  
  async refreshToken(req, res) {
    const { userId } = res.locals;
    const user = await Users.findOne({where: {id: userId}});
    const userData = createToken(user);
    return sendStatusData(res, 200, userData);
  },
    
  async registration(req, res) {
    const { fullName, password, email } = req.body;
    
    if(!validatePassword(password)) {
      return sendStatusData(res, 400, PASSWORD_INSTRUCTIONS);
    }
    if(!validateFullName(fullName)) {
      return sendStatusData(res, 400, FULL_NAME_INSTRUCTIONS);
    }
    if(!validateEmail(email)) {
      return sendStatusData(res, 400, EMAIL_INSTRUCTIONS);
    }
    
    const [firstName, lastName] = fullName.split(' ');
    try {
      const result = await Users.findOrCreate({where: {email}, defaults:{
          firstName: capitalizeFirstLetter(firstName),
          lastName: capitalizeFirstLetter(lastName),
          email,
          password,
        }
      });
      if(!result[1]) {
        return sendStatusData(res, 403, EMAIL_EXISTS);
      } else {
        await Tokens.create({UserId: result[0].dataValues.id});
        return sendStatusData(res, 200);
      }
    } catch (e) {
      errorLog('findOne by email', e);
      sendStatusData(res, 500);
    }
  },
  
  async delete(req, res) {
    const { userId } = res.locals;
    const { password } = req.body;
    
    try {
      const user = await Users.findOne({where: {id: userId}});
  
      if(!user) {
        return sendStatusData(res, 401, USER_NOT_FOUND);
      }
  
      if(user.password === password) {
        try {
          const response = await Users.destroy({where: {id: userId}});
          return sendStatusData(res, 200);
        } catch (e) {
          errorLog('destroy user', e);
          return sendStatusData(res, 500)
        }
      }
    } catch (e) {
      errorLog('findOne user by id', e);
      return sendStatusData(res, 500);
    }
  }
}