const { Router } = require('express');
const router = Router();
const { getUser, createUser, loginUser } = require("../controllers/user.controller");
const auth = require('../middlewares/auth');
const {
  userRegisterValidations,
  userLoginValidations,
} = require("../middlewares/validations");

//GET
router.post("/", auth, getUser);

//POST
router.post("/register", userRegisterValidations, createUser);
router.post("/login", userLoginValidations, loginUser);

module.exports = router;