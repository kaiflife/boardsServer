const {BOARD_NOT_FOUND, EMPTY_DATA} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { users: Users, boards: Boards, columns: Columns } = require('../../index');

module.exports = {
 
  async update(req, res) {
    const { title, columnId } = req.body;
    if(!title) {
      return sendStatusData(res, 405, EMPTY_DATA);
    }
    
    const column = await Columns.findByPk(columnId);
    if(!column) return sendStatusData(res, 404, BOARD_NOT_FOUND);
    
    await column.update({title});
    return sendStatusData(res, 200);
  },
  
  async getColumnsBoard(req, res) {
    const { userId } = req.locals;
    const user = await Users.findByPk(userId);
    const boards = await Boards.findAll({where: {id: [...user.boardsId, ...user.invitesId]}});
    return sendStatusData(res, 200, boards);
  },
  
  async delete(req, res) {
    const { columnId } = req.body;
    await Columns.destroy({where: {id: columnId}});
    return sendStatusData(res, 200);
  },
 
  async create(req, res) {
    const { userId } = req.locals;
    const { title } = req.body;
    const { boardId } = req.params;
    const board = await Boards.findByPk(boardId);
    await board.createColumns({ title, authorId: userId });
    return sendStatusData(res, 200);
  },
}