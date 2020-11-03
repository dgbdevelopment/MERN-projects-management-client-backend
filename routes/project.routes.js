const { Router } = require('express');
const router = Router();
const auth = require("../middlewares/auth");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const {projectValidations} = require("../middlewares/validations");

// GET
router.get("/", auth, getProjects);


// POST
router.post("/", auth, projectValidations, createProject);

//PUT
router.put("/:id", auth, projectValidations, updateProject);

//DELETE
router.delete('/:id', auth, deleteProject)


module.exports = router;