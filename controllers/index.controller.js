let indexController = {};

indexController.welcome = (req, res) => {
  res.status(200).send({msg: 'Estás en la página principal'})
}

module.exports = indexController;