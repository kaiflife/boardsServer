const {validateToken} = require("../helpers/validator");
const {
  BOARD_NOT_FOUND, DELETED_BOARD, DELETED_BOARD_FROM_LIST, EMPTY_DATA, INVALID_TOKEN,
  USER_NOT_FOUND,
} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { Users, Boards } = require('../../index');

module.exports = {
 
  async update(req, res) {
    const { title } = req;
    if(!title) return sendStatusData(res, 405, EMPTY_DATA);
    
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    const user = await Users.findOne({where: {id: userId}});
    if(!user) return sendStatusData(res, 401, USER_NOT_FOUND);
  
    const boardId = res.params.id;
    const board = await Boards.findByPk(boardId);
    if(!board) return sendStatusData(res, 404, BOARD_NOT_FOUND);
    
    await board.update({title});
    return sendStatusData(res, 200);
  },
  
  async getBoard(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    const { boardId } = req;
    
    const board = await Boards.findByPk(boardId);
    return sendStatusData(res, 200, board);
    
  },
  
  async delete(req, res) {
    const { boardId } = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401);
    
    const user = await Users.findOne({where: {id: userId}});
    if(!user) {
      return sendStatusData(res, 401, USER_NOT_FOUND)
    }
    
    const board = await Boards.findOne({where: {id: boardId}});
    if(!board) {
      return sendStatusData(res, 404, BOARD_NOT_FOUND);
    }
    const newOwnersId = board.ownersId.filter(ownerId => ownerId !== user.id);
    const newBoardsId = user.boardsId.filter(item => item !== boardId);
    const hasInviteId = user.invitesId.some(item => item === boardId);
    if(newOwnersId.length) {
      await Promise.all([
        board.update({ownersId: newOwnersId}),
        user.update({boardsId: newBoardsId})
      ])
      return sendStatusData(res, status, DELETED_BOARD_FROM_LIST);
    }
    
    if(hasInviteId) {
      const newInvitesId = user.invitesId.filter(item => item !== boardId);
      await Promise.all([
        board.update({ownersId: newOwnersId}),
        user.update({invitesId: newInvitesId}),
      ]);
      return sendStatusData(res, 200, DELETED_BOARD_FROM_LIST);
    }
    
    await Promise.all([
      Boards.destroy({where: {id: boardId}}),
      user.update({boardsId: newBoardsId})
    ]);
    return sendStatusData(res, 200, DELETED_BOARD)
  },
 
  async create(req, res) {
    const {title} = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 404, USER_NOT_FOUND);
    const user = await Users.findByPk(userId);
    
    const board = await Boards.create({title, ownersId: [userId]});
    await user.update({boardsId: [...user.boardsId, board.id]})
  },
}