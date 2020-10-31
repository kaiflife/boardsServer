const {validateToken} = require("../helpers/validator");
const {
  EMPTY_DATA, INVALID_TOKEN, TASK_NOT_FOUND,
  USER_NOT_FOUND,
} = require("../constants/responseStrings");
const sendStatusData = require("../helpers/sendStatusData");
const { Boards, Tasks } = require('../sequelize');

module.exports = {
  
  async update(req, res) {
    const { title, text, taskId } = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401, INVALID_TOKEN);
    
    if(!title) {
      return sendStatusData(res, 405, EMPTY_DATA);
    }
    
    const task = await Tasks.findByPk(taskId);
    if(!taskId) return sendStatusData(res, 404, TASK_NOT_FOUND);
    
    await task.update({title, text});
    return sendStatusData(res, 200);
  },
  
  async delete(req, res) {
    const { taskId } = req;
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 401);
    
    await Tasks.destroy({where: {id: taskId}});
    return sendStatusData(res, 200);
  },
  
  async create(req, res) {
    const userId = validateToken(req.headers.authorization);
    if(!userId) return sendStatusData(res, 404, USER_NOT_FOUND);
    const { title, text, columnId } = req;
    const column = await Boards.findByPk(columnId);
    await column.createTasks({ title, text, authorId: userId });
    return sendStatusData(res, 200);
  },
}