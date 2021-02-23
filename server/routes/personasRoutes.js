let express = require('express');
let router = express.Router();
const { authJwt } = require("../middleware");
const personas= require('../controllers/personasController.js');
//crear
router.post('/personas/create', personas.create);
//leer todos
router.get('/personas/', [authJwt.verifyToken],personas.retrieveAllPersonas);
//tomar una persona
router.get('/personas/:id', [authJwt.verifyToken],personas.getPersonaById);
//actualizar
router.put('/personas/:id', [authJwt.verifyToken],personas.updateById);
//eliminar
router.delete('/personas/:id', [authJwt.verifyToken],personas.deleteById);

module.exports = router;