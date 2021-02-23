module.exports=(sequelize, type)=>{
    const User=sequelize.define('user',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        usuario:{
            type:type.STRING,
            validate:{
                notEmpty: true
            }
        },
        email:{
            type:type.STRING,
            validate:{
                notEmpty: true,
                isEmail: true
            }
        },
        password:{
            type:type.STRING,
            validate:{
                notEmpty: true
            }
        }
    },{
        timestamps:true
    })
    return User
}