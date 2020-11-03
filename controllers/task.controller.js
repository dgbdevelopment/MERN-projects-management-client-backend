const { validationResult } = require('express-validator');
const Task = require("../models/task.model");
const Project = require("../models/project.model");

let taskController = {}

//POST /api/task
taskController.createTask = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Buscar si existe la id del proyecto en la BDD
  let project;
  try {
    project = await Project.findById(req.body.projectId);
    if (!project) throw error;
  } catch {
    return res
      .status(404)
      .send({ msg: "Proyecto no encontrado con id: " + req.body.projectId });
  }
  //Verificar que el proyecto corresponda al usuario logueado
  if (project.owner.toString() !== req.user.id) return res.status(401).send({ msg: 'El proyecto no te pertenece' });
  //Crear la Tarea
  const newTask = new Task(req.body);
  try {
    const task = await newTask.save();
    return res.status(200).send({msg: 'Tarea creada con éxito', task})
  } catch (err) {
    return res.status(500).send({msg: 'Error creando la tarea: '+err.message})
  }
};

//GET /api/task/:projectId
taskController.getTasks = async (req, res) => {
  //Buscar si existe la id del proyecto en la BDD
  let project;
  try {
    project = await Project.findById(req.params.projectId);
    if (!project) throw error;
  } catch {
    return res
      .status(404)
      .send({ msg: "Proyecto no encontrado con id: " + req.params.projectId });
  }
  //Verificar que el proyecto corresponda al usuario logueado
  if (project.owner.toString() !== req.user.id) return res.status(401).send({ msg: 'El proyecto no te pertenece' });
  //Obtener las tareas
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    return res.status(200).send({ msg: "Tareas encontradas", tasks });
  } catch (err) {
    return res.status(500).send({msg: 'Error al buscar tareas: '+err.message})
  }
}

//PUT /api/task/:id
taskController.updateTask = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  try {
    //Verificar que exista la tarea en la BDD
    const task = await Task.findById(req.params.id);
    if (!task) throw new Error('Tarea no encontrada');
    //Verificar que elproyecto tambien exista
    const project = await Project.findById(task.projectId);
    if (!project) throw new Error('Proyecto no encontrado')
    //Verificar que el proyecto pertenezca al usuario logueado
    if (project.owner.toString() !== req.user.id) throw new Error('El proyecto no te pertenece')
    //Actualizar tarea
    const taskUpdated = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    return res.status(200).send({msg: 'Tarea actualizada con éxito', taskUpdated})    
  } catch (err) {
    return res.status(404).send({msg: err.message})
  }
}

//DELETE /api/task/:id
taskController.deleteTask = async (req, res) => {
  try {
    //Verificar que exista la tarea en la BDD
    const task = await Task.findById(req.params.id);
    if (!task) throw new Error('Tarea no encontrada');
    //Verificar que el proyecto tambien exista
    const project = await Project.findById(task.projectId);
    if (!project) throw new Error('Proyecto no encontrado')
    //Verificar que el proyecto pertenezca al usuario logueado
    if (project.owner.toString() !== req.user.id) throw new Error('El proyecto no te pertenece')
    //Borramos tarea
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
    });    
    return res
      .status(200)
      .send({ msg: "Tarea borrada con éxito:", deletedTask });
  }catch (err) {
    return res.status(404).send({ msg: err.message });
  }
} 

module.exports = taskController;
