let express = require('express');
let router = express.Router();
const users= require('../controllers/userController.js');
//control middleware
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
//crear (signup)
router.post('/signup',[
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ], users.create);

  
//loguearse (signin)
router.post('/signin', users.signin);
//leer todos
router.get('/', [authJwt.verifyToken, authJwt.isModeratorOrAdmin], users.retrieveAll);
//tomar una persona
router.get('/:id', users.getById);
//actualizar
router.put('/:id', users.updateById);
//eliminar
router.delete('/:id', users.deleteById);



module.exports = router;