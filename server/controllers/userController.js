const db = require('../config/db.config.js');
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;
//token
const jwt=require('jsonwebtoken');
//bcrypt
const bcrypt = require("bcryptjs");
//secretkey
const config = require("../config/auth.config");

//crear
exports.create = (req, res) => {
    try{
        // Save to MySQL database
        User.create({
          usuario:req.body.usuario,
          email:req.body.email,
          password:bcrypt.hashSync(req.body.password, 8)
        }).then(user => {    
            if (req.body.roles) {
               
                Role.findAll({
                    where: {
                      name: {
                        [Op.or]: req.body.roles
                      }
                    }
                  }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.status(200).json({
                            message: "User registered successfully!" 
                        });
                    });
                  });
                
             
               
              } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.status(200).json({
                        message: "User registered successfully!" 
                    });
                });
              }
        });
  
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

//signin loguearse
exports.signin = async(req, res) => {
    try{
        // Save to MySQL database
        const{usuario,password}=req.body;
        const user=await User.findOne({ where: { usuario: usuario} });
        if(!user){
            // return a response to client
            return res.status(404).json({
                message: "Not Found a user ",
                user: "",
                error: "404"
            });
        }  
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid){
            return res.status(404).json({
                message: "Password incorrect",
                user: "",
                error: "404"
            });
        }
          
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });


        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                message: "Signin Successfully a User with id = " + user.id,
                token: token,
                user:user,
                roles:authorities
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
exports.retrieveAll = (req, res) => {
    // find all Personas information from 
    User.findAll()
        .then(userInfos => {
            res.status(200).json({
                message: "Get all User's Infos Successfully!",
                users: userInfos
            });
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
exports.getById = (req, res) => {
  // find all Persona information from 
  let userId = req.params.id;
  User.findByPk(userId)
      .then(user=> {
          res.status(200).json({
              message: " Successfully Get a User with id = " + userId,
              user: user
          });
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
        let userId = req.params.id;
        let user = await User.findByPk(userId);
    
        if(!user){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a persona with id = " + userId,
                user: "",
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
            let result = await User.update(updatedObject, {returning: true, where: {id: userId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a user with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a user with id = " + userId,
                persona: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a user with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let userId = req.params.id;
        let user= await User.findByPk(userId);

        if(!user){
            res.status(404).json({
                message: "Does Not exist a user with id = " + userId,
                error: "404",
            });
        } else {
            await User.destroy({
              where:{id:userId}
          });
            res.status(200).json({
                message: "Delete Successfully a user with id = " + userId,
                user: user
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a user with id = " + req.params.id,
            error: error.message
        });
    }
}




