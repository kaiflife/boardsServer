const {EMPTY_DATA, TASK_NOT_FOUND} = require("../constants/responseStrings");
const { sendStatusData } = require("../helpers/sendStatusData");
const { Cards } = require('../../index');

module.exports = {
  
  async update(req, res) {
    const { title, text, taskId } = req.body;
    if(!title) {
      return sendStatusData(res, 405, EMPTY_DATA);
    }
    
    const task = await Cards.findByPk(taskId);
    if(!taskId) return sendStatusData(res, 404, TASK_NOT_FOUND);
    
    await task.update({title, text});
    return sendStatusData(res, 200);
  },
  
  async delete(req, res) {
    const { taskId } = req.body;
    await Cards.destroy({where: {id: taskId}});
    return sendStatusData(res, 200);
  },
  
  async create(req, res) {
    const { userId } = res.locals;
    const { title, text, columnId } = req.body;
    await Cards.create({ title, text, authorId: userId, columnId});
    return sendStatusData(res, 200);
  },
}