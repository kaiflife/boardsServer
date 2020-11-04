const {
  BOARD_NOT_FOUND, DELETED_BOARD, DELETED_BOARD_FROM_LIST, EMPTY_DATA,
  USER_NOT_FOUND, SOMETHING_WENT_WRONG, BOARD_TITLE_INSTRUCTIONS,
} = require("../constants/responseStrings");
const { Op } = require("sequelize");
const { sendStatusData } = require("../helpers/sendStatusData");
const { Users, Boards } = require('../../index');

module.exports = {
  async update(req, res) {
    const { title } = req.body;
    if(!title) return sendStatusData(res, 405, EMPTY_DATA);
    const { userId } = res.locals;
  
    const user = await Users.findOne({where: {id: userId}});
    if(!user) return sendStatusData(res, 401, USER_NOT_FOUND);
  
    const boardId = res.params.id;
    const board = await Boards.findByPk(boardId);
    if(!board) return sendStatusData(res, 404, BOARD_NOT_FOUND);
    
    await board.update({title});
    return sendStatusData(res, 200);
  },
  
  async getBoards(req, res) {
    try {
      const { userId } = res.locals;
      const { boardId, boardsType } = req.query;
      if(boardId) {
        const board = await Boards.findByPk(boardId);
        return sendStatusData(res, 200, board.dataValues);
      }
      let data;
      
      if(boardsType === 'all') {
        const ownersBoards = await Boards.findAll({where: {ownersId: {[Op.contains]: [userId]}}});
        const invitesBoards = await Boards.findAll({where: {invitesId: {[Op.contains]: [userId]}}});
        const ownersBoardsValues = ownersBoards.map(board => ({title: board.title, id: board.id}));
        const invitesBoardsValues = invitesBoards.map(board => board.dataValues);
        data = {ownersBoards: ownersBoardsValues, invitesBoards: invitesBoardsValues};
        
      } else if(boardsType === 'owner') {
        const ownersBoards = await Boards.findAll({where: {ownersId: {[Op.contains]: [userId]}}});
        const ownersBoardsValues = ownersBoards.map(board => board.dataValues);
        data = {ownersBoards: ownersBoardsValues};
        
      } else {
        const invitesBoards = await Boards.findAll({where: {invitesId: {[Op.contains]: [userId]}}});
        const invitesBoardsValues = invitesBoards.map(board => board.dataValues);
        data = {invitesBoards: invitesBoardsValues};
      }
      
      return sendStatusData(res, 200, data);
    } catch (e) {
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
  },
  
  async delete(req, res) {
    const { boardId } = req.body;
    const { userId } = res.locals;
    
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
    const { title } = req.body;
    const { userId } = res.locals;
    
    try {
      if(!userId) return sendStatusData(res, 404, USER_NOT_FOUND);
      if(typeof title !== 'string' || title.length > 50) return sendStatusData(res, 404, BOARD_TITLE_INSTRUCTIONS);
  
      const user = await Users.findByPk(userId);
      const board = await Boards.create({title, ownersId: [userId]});
      
      const boardsId = user.dataValues.boardsId || [];
      await user.update({boardsId: [...boardsId, board.dataValues.id]});
      return sendStatusData(res, 200);
    } catch (e) {
      console.log(e, e.message);
      return sendStatusData(res, 500, SOMETHING_WENT_WRONG);
    }
    
  },
}