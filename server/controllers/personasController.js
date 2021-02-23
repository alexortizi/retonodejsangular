const db = require('../config/db.config.js');
const Persona = db.Persona;
//crear
exports.create = (req, res) => {
    try{
        // Save to MySQL database
        Persona.create({
          nombres:req.body.nombres,
          apellidos:req.body.apellidos,
          edad:req.body.edad,
          fechaIngreso:req.body.fechaIngreso,
          activo:req.body.activo
        }).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Persona with id = " + result.id,
                persona: result,
            });
        });
  
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

//listado de personas
exports.retrieveAllPersonas = (req, res) => {
    // find all Personas information from 
    Persona.findAll()
        .then(personaInfos => {
            res.status(200).json(personaInfos);
        })
        . catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
}
//mostrar una persona
exports.getPersonaById = (req, res) => {
  // find all Persona information from 
  let personaId = req.params.id;
  Persona.findByPk(personaId)
      .then(persona=> {
          res.status(200).json(persona);
      })
      . catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}

//actuailizar una persona
exports.updateById = async (req, res) => {
    try{
        let personaId = req.params.id;
        let persona = await Persona.findByPk(personaId);
    
        if(!persona){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a persona with id = " + personaId,
                persona: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
              nombres:req.body.nombres,
              apellidos:req.body.apellidos,
              edad:req.body.edad,
              fechaIngreso:req.body.fechaIngreso,
              activo:req.body.activo
            }
            let result = await Persona.update(updatedObject, {returning: true, where: {id: personaId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a persona with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a persona with id = " + personaId,
                persona: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a persona with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let personaId = req.params.id;
        let persona = await Persona.findByPk(personaId);

        if(!persona){
            res.status(404).json({
                message: "Does Not exist a persona with id = " + personaId,
                error: "404",
            });
        } else {
            await Persona.destroy({
              where:{id:personaId}
          });
            res.status(200).json({
                message: "Delete Successfully a persona with id = " + personaId,
                persona: persona,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a persona with id = " + req.params.id,
            error: error.message,
        });
    }
}