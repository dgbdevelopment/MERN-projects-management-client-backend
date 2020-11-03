const User = require('../models/user.model');
const { validationResult } = require('express-validator')
const { getToken } = require('../helpers/jwt');

let userController = {}

//POST /api/user
userController.getUser = (req, res) => {
  return res.status(200).send({ user: req.user});
};

// POST /api/user/register
userController.createUser = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Verificar que el usuario no exista
  const { email } = req.body;
  const checkforEmail = await User.findOne({ email });
  if (checkforEmail)
    return res
      .status(400)
      .send({ errors: [{ msg: "El email proporcionado ya está registrado" }] });
  //Crear usuario con los datos que nos llegan
  const newUser = new User(req.body);
  //Encriptar el password
  newUser.password = await newUser.encryptPassword(newUser.password);
  //Guardar usuario
  await newUser.save((err, user) => {
    if (err)
      return res
        .status(400)
        .send({errors: [{ msg: "Error al crear usuario", reason: err.message }]});
    const token = getToken(user);
    if (token.err) return res.status(401).send({errors: [{msg: "Error al obtener el token. " + token.err.message}]})
    return res
      .status(200)
      .send({ msg: "El usuario ha sido registrado correctamente.", token, user: { id: newUser.id, username: newUser.username } });
  });
}

// POST /api/user/login
userController.loginUser = async (req, res) => {
  // const token = req.headers.authorization.split(' ')[1];
  //Validamos lo que llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Verificamos que el usuario exista
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({
    errors: [{ msg: "El email introducido no existe en nuestra base de datos." }]
  });
  
  //Comprobamos el password
  const matchPassword = await user.matchPassword(req.body.password, user.password);
  if (!matchPassword) return res.status(400).send({errors: [{ msg: 'La contraseña introducida es incorrecta.' }]})
  //Obtenemos un nuevo token
  const token = getToken(user);
  if (token.err)
    return res.status(401).send({errors: [{ msg: "Error al obtener el token. " + token.err.message }]});
  //Mandamos los datos
  res.status(200).send({ msg: 'Usuario logeado correctamente', token, user: {id: user.id, username: user.username} })
}

module.exports = userController;