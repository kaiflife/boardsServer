const {EMPTY_DATA, TASK_NOT_FOUND} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { boards: Boards, tasks: Tasks } = require('../../index');

module.exports = {
  
  async update(req, res) {
    const { title, text, taskId } = req.body;
    if(!title) {
      return sendStatusData(res, 405, EMPTY_DATA);
    }
    
    const task = await Tasks.findByPk(taskId);
    if(!taskId) return sendStatusData(res, 404, TASK_NOT_FOUND);
    
    await task.update({title, text});
    return sendStatusData(res, 200);
  },
  
  async delete(req, res) {
    const { taskId } = req.body;
    await Tasks.destroy({where: {id: taskId}});
    return sendStatusData(res, 200);
  },
  
  async create(req, res) {
    const { userId } = req.locals;
    const { title, text, columnId } = req.body;
    const column = await Boards.findByPk(columnId);
    await column.createTasks({ title, text, authorId: userId });
    return sendStatusData(res, 200);
  },
}