import {validateToken} from "../../helpers/validator";
import {
 BOARD_NOT_FOUND, ID_TASK_EXISTS, INVALID_PASSWORD,
 SOMETHING_WENT_WRONG,
 USER_NOT_FOUND,
} from "../../constants/errorStrings";
import {errorLog} from "../../helpers/errorLog";
const { Users } = require('../../app');
const { Boards } = require('../../app');

module.exports = {
 
    update(req, res) {
        
      const { title, taskId: newTaskId } = req;
      const boardId = res.params.id;
      const password = res.query.password;
      
      const userId = validateToken(req.headers.authorization);

      Users.findOne({where: {id: userId}})
       .then(async user => {
        if(!user) return res.send.status(401).json(USER_NOT_FOUND);

        if(!user.password === password) return res.send.status(401).json(INVALID_PASSWORD);
        
        const updatedData = {};
        if(title) updatedData.title = title;

        if(newTaskId) {
         const board = await Boards.findOne({where: {id: boardId}});
         
         if(!board) return res.send.status(404).json(BOARD_NOT_FOUND);
         if(board.tasksId.some(taskId => taskId === newTaskId)) return res.send.status(404).json(ID_TASK_EXISTS);
         
         updatedData.tasksIds = [...board.tasksId, newTaskId];
         
         Boards.update(updatedData, {where: {id: boardId}})
          .then(() => res.send.status(200)).catch(e => {
           errorLog(`update Boards id: ${boardId}`);
           res.send.status(500).json(SOMETHING_WENT_WRONG);
         })
        }
       })
    },
    
    delete(req, res) {
      const { password } = req;
      const userId = validateToken(req.headers.authorization);
      if(!userId) return res.send.status(401);
      
      Users.findOne({where: {id: userId}})
       .then(user => {
           if(!user) {
               res.send.status(401).json(USER_NOT_FOUND);
           }
           
           if(user.password === password) {
               Users.destroy({where: {id: userId}})
                .then(() => res.send.status.status(200))
                .catch(e => {
                    console.error(e, typeof e === 'object' && e.message);
                    return res.send.status(500).json(SOMETHING_WENT_WRONG);
                })
           }
       })
    },
 
  create(req, res) {

    const { title } = req;
    const boardId = res.params.id;
    const password = res.query.password;
    
    const userId = validateToken(req.headers.authorization);
    
    Users.findOne({where: {id: userId}})
     .then(async user => {
      if(!user) return res.send.status(401).json(USER_NOT_FOUND);
      
      if(!user.password === password) return res.send.status(401).json(INVALID_PASSWORD);
      
      const updatedData = {};
      if(title) updatedData.title = title;
      
      if(newTaskId) {
       const board = await Boards.findOne({where: {id: boardId}});
       
       if(!board) return res.send.status(404).json(BOARD_NOT_FOUND);
       if(board.tasksId.some(taskId => taskId === newTaskId)) return res.send.status(404).json(ID_TASK_EXISTS);
       
       updatedData.tasksIds = [...board.tasksId, newTaskId];
       
       Boards.update(updatedData, {where: {id: boardId}})
        .then(() => res.send.status(200)).catch(e => {
        errorLog(`update Boards id: ${boardId}`);
        res.send.status(500).json(SOMETHING_WENT_WRONG);
       })
      }
     })
   },
}