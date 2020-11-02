const {BOARD_NOT_FOUND, EMPTY_DATA} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { Users, Boards, Columns } = require('../../index');

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
    const { userId } = res.locals;
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
    const { userId } = res.locals;
    const { title } = req.body;
    const { boardId } = req.params;
    await Columns.create({ title, authorId: userId, boardId });
    return sendStatusData(res, 200);
  },
}