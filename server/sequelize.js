const Sequelize=require('sequelize')

const PersonaModel=require('./models/Persona')
const DBURL='mysql://root:@localhost:3306/api-agenda'

const sequelize=new Sequelize(DBURL)

const Persona=PersonaModel(sequelize, Sequelize)

sequelize.sync()
    .then(()=>{
        console.log('Tablas creadas')
    })

    module.exports={
        Persona
    }