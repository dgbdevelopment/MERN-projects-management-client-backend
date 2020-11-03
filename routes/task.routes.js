const { Router } = require('express');
const router = Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const auth = require("../middlewares/auth");
const {taskValidations} = require("../middlewares/validations");

//POST
router.post("/", auth, taskValidations, createTask);

//GET
router.get('/:projectId', auth, getTasks)

//PUT
router.put('/:id', auth, taskValidations, updateTask);

//DELETE
router.delete('/:id', auth, deleteTask);

module.exports = router;