const {validateEmail, validateFullName, validatePassword, validateToken} = require( "../helpers/validator");
const {errorLog} = require("../helpers/errorLog");
const { capitalizeFirstLetter } = require('../helpers/capitalizeFirstLetter');
const { getTokenExpiredTime } = require('../helpers/getTokenExpiredTime');
const crypto = require('crypto');
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

const { boards: Boards, users: Users } = require('../../index');

const generateToken = (user) => {
  const head = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'jwt' })
  ).toString('base64')
  let body = Buffer.from(JSON.stringify(user)).toString(
    'base64'
  )
  const signature = crypto
    .createHmac('SHA256', process.env.AUTH_TOKEN)
    .update(`${head}.${body}`)
    .digest('base64');
  return `${head}.${body}.${signature}`;
}

function createToken(user) {
  const accessToken = generateToken(user);
  const refreshToken = generateToken(user);
  
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    token: accessToken,
    refreshToken,
  };
}

module.exports = {
  async auth(req, res) {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({where: {email}});
      if(!user) {
        return sendStatusData(res, 404, USER_NOT_FOUND);
      }
  
      if(user.password !== password) {
        return sendStatusData(res, 401, INVALID_PASSWORD);
      }
  
      const userData = createToken(user);
      
      const refreshTokenExpiredIn = getTokenExpiredTime(120);
      const accessTokenExpiredIn = getTokenExpiredTime(2);
      
      const accessToken = userData.token;
      const refreshToken = userData.refreshToken;
      
      const tokens = await user.getTokens();
      await tokens.update({
        accessToken,
        refreshToken,
        refreshTokenExpiredIn,
        accessTokenExpiredIn,
      });
      return sendStatusData(res, 200, userData);
      
    } catch(e) {
      errorLog('auth User', e);
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
  },
  
  async logout(req, res) {
    const { userId } = req.locals;
    
    try {
      const user = await Users.findOne({where: {id: userId}});
      if(!user) return sendStatusData(res, 404, USER_NOT_FOUND);
      
      const tokens = await user.getTokens();
      await tokens.update({
        accessToken: null,
        refreshToken: null,
        refreshTokenExpiredIn: null,
        accessTokenExpiredIn: null
      });
      return sendStatusData(res, 200);
    } catch (e) {
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
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
    
    const { userId } = req.locals;
    
    const updatedData = {};
    if(firstName) updatedData.firstName = firstName;
    if(lastName) updatedData.lastName = lastName;
    if(password) updatedData.password = password;
    if(email) updatedData.email = email;
    
    try {
      await Users.update(updatedData, {where: {userId}});
      sendStatusData(res, 200, 'updated');
    } catch (e) {
      errorLog('update user', e);
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
  },
  
  async getUser(req, res) {
    const { userId } = req.locals;
    const { usersId } = req.body;
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
        const invitesId = newBoardUser.invitesId.filter(id => id !== newBoardUserId);
        const boardsId = [...newBoardUser.boardsId, boardId];
    
        const participantsId = board.participantsId.filter(id => id !== newBoardUserId);
        const ownersId = [...board.participantsId, newBoardUserId];
    
        await Promise.all([
          newBoardUser.update({ invitesId, boardsId }),
          board.update({ participantsId, ownersId })
        ]);
    
      } else {
        const invitesId = [...newBoardUser.invitesId, boardId];
        const boardsId = newBoardUser.boardsId.filter(id => id !== boardId);
  
        const participantsId = [...board.participantsId, newBoardUserId]
        const ownersId = board.ownersId.filter(id => id !== newBoardUserId);
        
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
    console.log('req.locals', req.locals);
    const { userId } = req.locals;
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
      const user = await Users.findOrCreate({where: {email}, defaults: {
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        email,
        password,
      }});
      const tokensResult = await user.getTokens();
      console.log(tokensResult);
      if(!user[1]) {
        return sendStatusData(res, 403, EMAIL_EXISTS);
      } else {
        return sendStatusData(res, 200, 'created');
      }
    } catch (e) {
      errorLog('findOne by email', e);
      sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
  },
  
  async delete(req, res) {
    const { password } = req.body;
    const userId = await validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 404, USER_NOT_FOUND);
    
    try {
      const user = await Users.findOne({where: {id: userId}});
  
      if(!user) {
        return sendStatusData(res, 401, USER_NOT_FOUND);
      }
  
      if(user.password === password) {
        try {
          const response = await Users.destroy({where: {id: userId}});
          console.log(response);
          return sendStatusData(res, 200, 'deleted');
        } catch (e) {
          errorLog('destroy user', e);
          return sendStatusData(res, 500, SOMETHING_WENT_WRONG)
        }
  
      }
    } catch (e) {
      errorLog('findOne user by id', e);
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
  }
}