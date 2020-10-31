const {validateEmail, validateFullName, validatePassword, validateToken} = require( "../helpers/validator");
const {errorLog} = require("../helpers/errorLog");
const {
  BOARD_NOT_FOUND,
  EMAIL_EXISTS,
  EMAIL_INSTRUCTIONS,
  FULL_NAME_INSTRUCTIONS,
  INVALID_PASSWORD,
  INVALID_TOKEN,
  PASSWORD_INSTRUCTIONS,
  SOMETHING_WENT_WRONG,
  USER_NOT_FOUND
} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");

const { Boards, Users } = require('../../index');

module.exports = {
  async auth(req, res) {
    const { email, password } = req;
    try {
      await createToken({email, password, res});
    } catch(e) {
      errorLog('auth User', e);
      res.send.status(500).json(SOMETHING_WENT_WRONG);
    }
  },
    
  async update(req, res) {
    
    const { fullName, email, password } = req;
    
    if(!validatePassword(password)) {
        return res.status(400).json(PASSWORD_INSTRUCTIONS);
    }
    if(validateFullName(fullName)) {
        return res.status(400).json(FULL_NAME_INSTRUCTIONS);
    }
    if(validateEmail(email)) {
        return res.status(400).json(EMAIL_INSTRUCTIONS);
    }
    
    const [ firstName, lastName ] = fullName.split(' ' );
    
    const id = validateToken(req.headers.authorization);
    
    const updatedData = {};
    if(firstName) updatedData.firstName = firstName;
    if(lastName) updatedData.lastName = lastName;
    if(password) updatedData.password = password;
    if(email) updatedData.email = email;
    
    try {
      await Users.update(updatedData, {where: {id}});
      res.send.status(200);
    } catch (e) {
      errorLog('update user', e);
      res.send.status(500).json(SOMETHING_WENT_WRONG);
    }
  },
  
  async getUser(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    const user = await Users.findByPk(userId);
    return sendStatusData(res, 200, user);
  },
  
  async invite(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
  
    const { invitedUserId, ownerId, boardId } = req.query;
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
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    const { targetUserId, boardId } = req.query;
    
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
    
  async registration(req, res) {
    const { fullName, password, email } = req;
    const { err, payload } = validateToken(req.headers.authorization);
    if(err || !payload) {
        return res.send.status(401).json(INVALID_TOKEN);
    }
    
    if(!validatePassword(password)) {
        return res.status(400).json(PASSWORD_INSTRUCTIONS);
    }
    if(validateFullName(fullName)) {
        return res.status(400).json(FULL_NAME_INSTRUCTIONS);
    }
    if(validateEmail(email)) {
        return res.status(400).json(EMAIL_INSTRUCTIONS);
    }
    
    const [firstName, lastName] = fullName.split(' ');
    try {
      const user = await Users.findOne({where: {email}});
      if(user.email === email) {
        return res.status(403).json(EMAIL_EXISTS);
      }
  
      try {
        await Users.create({
          firstName,
          lastName,
          email,
          password,
        });
        res.send.status(201);
      } catch (e) {
        errorLog('create user', e);
        res.send.status(500).json(SOMETHING_WENT_WRONG);
      }
    } catch (e) {
      errorLog('findOne by email', e);
      res.send.status(500).json(SOMETHING_WENT_WRONG);
    }
  },
  
  async delete(req, res) {
    const { password } = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return res.send.status(401);
    
    try {
      const user = await Users.findOne({where: {id: userId}});
  
      if(!user) {
        res.send.status(401).json(USER_NOT_FOUND);
      }
  
      if(user.password === password) {
        try {
          const response = await Users.destroy({where: {id: userId}});
          console.log(response);
          return res.send.status.status(200);
        } catch (e) {
          errorLog('destroy user', e);
          return res.send.status(500).json(SOMETHING_WENT_WRONG);
        }
  
      }
    } catch (e) {
      errorLog('findOne user by id', e);
      res.send.status(500).json(SOMETHING_WENT_WRONG);
    }
  }
}


async function createToken ({email, password, res}) {
    return await Users.findOne({where: {email}})
     .then(user => {
         
         if(!user) {
             return sendStatusData(res, 404, USER_NOT_FOUND);
         }
         
         if(user.password !== password) {
             return sendStatusData(res, 401, INVALID_PASSWORD);
         }
         
         const head = Buffer.from(
          JSON.stringify({ alg: 'HS256', typ: 'jwt' })
         ).toString('base64')
         let body = Buffer.from(JSON.stringify(user)).toString(
          'base64'
         )
         const signature = crypto
          .createHmac('SHA256', process.env.AUTH_TOKEN)
          .update(`${head}.${body}`)
          .digest('base64')
         
         return sendStatusData(res, 200, {
           id: user.id,
           fullName: [user.firstName, user.lastName].join(' '),
           token: `${head}.${body}.${signature}`,
         })
     }).catch( err => {
         console.error(err);
         return res.send.status(500).json(SOMETHING_WENT_WRONG)
     });
}