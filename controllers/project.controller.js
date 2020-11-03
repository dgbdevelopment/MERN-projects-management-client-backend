const Project = require("../models/project.model");
const Task = require("../models/task.model");
const { validationResult } = require("express-validator");

let projectController = {};

// GET api/project
projectController.getProjects = (req, res) => {
  Project.find({ owner: req.user.id }, (err, results) => {
    if (err) return res.status(400).send({ msg: "Error al buscar projectos. " + err.message });
    return res.status(200).send({ results })
  })
}

// POST /api/project
projectController.createProject = (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Guardar proyecto en la BDD
  const newproject = new Project({ name: req.body.name, owner: req.user.id });
  newproject.save((err, project) => {
    if (err) return res.status(400).send({ msg: 'Error al crear proyecto' })
    res.status(200).send({ msg: "Proyecto creado", project });
  })
}

//PUT /api/project/:id
projectController.updateProject = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Buscar si existe la id del proyecto en la BDD
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (!project) throw error;
  } catch {
    return res
      .status(404)
      .send({ msg: "Proyecto no encontrado con id: " + req.params.id });
  }
  //Verificar que el proyecto corresponda al usuario logueado
  if (project.owner.toString() !== req.user.id) return res.status(401).send({ msg: 'El proyecto que quieres editar no te pertenece' })
  //Finalmente, actualizar el proyecto
  try {
    const result = await Project.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    return res
      .status(200)
      .send({ msg: "Proyecto actualizado correctamente", result });
  } catch (err) {
    return res.status(400).send({msg: 'Error al actualizar proyecto. '+ err.message})
  }
}

//DELETE /api/project/:id
projectController.deleteProject = async (req, res) => {
  //Buscar si existe la id del proyecto en la BDD
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (!project) throw error
  } catch {
    return res
      .status(404)
      .send({ msg: "Proyecto no encontrado con id: " + req.params.id });
  }
  //Verificar que el proyecto corresponda al usuario logueado
  if (project.owner.toString() !== req.user.id) return res.status(401).send({ msg: 'El proyecto que quieres editar no te pertenece' })
  //Finalmente, eliminamos el proyecto
  try {
    const deletedProject = await Project.findOneAndDelete({
      _id: req.params.id,
    });
    //Después borramos todas las tareas relativas al proyecto
    await Task.deleteMany({ projectId: req.params.id });
    return res
      .status(200)
      .send({ msg: "Proyecto borrado con éxito:", deletedProject });
  } catch (err) {
    return res.status(400).send({msg: 'Hubo un error eliminado el proyecto: '+err.message})
  }
}

module.exports = projectController;