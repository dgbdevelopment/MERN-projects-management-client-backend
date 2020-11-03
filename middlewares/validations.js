const { check } = require('express-validator');

const passwordRegEx = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~|:"`'<>,.\/?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

const userRegisterValidations = [
  check("username", "El nombre de usuario es obligatorio")
    .not().isEmpty(),
  check("email", "El email no es válido").isEmail(),
  check(
    "password",
    "La contraseña debe contener 8 caracteres mínimo con al menos: 1 miníscula, 1 mayúscula, 1 número y un caracter especial"
  ).custom(value => {
    if (!passwordRegEx.test(value)) return false;
    return true;
  }),
  check('confirm', 'Las contraseñas no coinciden').custom((value, { req }) => {
    if (value !== req.body.password) return false;
    return true;
  })
];

const userLoginValidations = [
  check("email", "El email no es válido").isEmail(),
  check(
    "password",
    "La contraseña debe contener 8 caracteres mínimo con al menos: 1 miníscula, 1 mayúscula, 1 número y un caracter especial"
  ).custom((value) => {
    if (!passwordRegEx.test(value)) return false;
    return true;
  }),
];

const projectValidations = [
  check("name", "El nombre del proyecto no puede estar vacío").not().isEmpty(),
];

const taskValidations = [
  check("taskname", "El nombre de la tarea no puede estar vacío").not().isEmpty(),
];



module.exports = {
  userRegisterValidations,
  userLoginValidations,
  projectValidations,
  taskValidations,
};

