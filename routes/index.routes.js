const { Router } = require('express');
const router = Router();
const {welcome} = require('../controllers/index.controller')

router.get('/', welcome)


module.exports = router;