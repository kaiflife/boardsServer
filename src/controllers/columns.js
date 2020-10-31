const {validateToken} = require("../helpers/validator");
const {
  BOARD_NOT_FOUND, EMPTY_DATA, INVALID_TOKEN,
  USER_NOT_FOUND,
} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { Users, Boards, Columns } = require('../../index');

module.exports = {
 
  async update(req, res) {
    
    const { title, columnId } = req;
    
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    if(!title) {
      return sendStatusData(res, 405, EMPTY_DATA);
    }
    
    const column = await Columns.findByPk(columnId);
    if(!column) return sendStatusData(res, 404, BOARD_NOT_FOUND);
    
    await column.update({title});
    return sendStatusData(res, 200);
  },
  
  async getColumnsBoard(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    const user = await Users.findByPk(userId);
    
    const boards = await Boards.findAll([...user.boardsId, ...user.invitesId]);
    return sendStatusData(res, 200, boards);
  },
  
  async delete(req, res) {
    const { columnId } = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401);
    
    await Columns.destroy({where: {id: columnId}});
    return sendStatusData(res, 200);
  },
 
  async create(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 404, USER_NOT_FOUND);
    const { title } = req;
    const { boardId } = req.params;
    const board = await Boards.findByPk(boardId);
    await board.createColumns({ title, authorId: userId });
    return sendStatusData(res, 200);
  },
}