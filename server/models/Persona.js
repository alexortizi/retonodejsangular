module.exports=(sequelize, type)=>{
    const Persona=sequelize.define('persona',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        nombres:{
            type:type.STRING,
            validate:{
                notEmpty: true
            }
        },
        apellidos:{
            type:type.STRING,
            validate:{
                notEmpty: true
            }
        },
        edad:{
            type:type.NUMERIC,
            validate:{
                isNumeric: true
            }
            
        },
        fechaIngreso:{
            type:type.DATEONLY,
            validate:{
                isDate: true
            }
        },
        activo:{
            type:type.BOOLEAN,
            defaultValue: true
        }
    },{
        timestamps:true
    })
    return Persona
}