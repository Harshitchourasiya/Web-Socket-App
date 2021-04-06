const express = require('express');
//controllers
const user = require('../controllers/user.js');
//middelwares
const { encode } = require('../middlewares/jwt.js');

const router = express.Router();

router.post('/login/:userId',encode,function callback(req, res, next){   });
module.exports = router;