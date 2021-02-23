const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.Persona = require('../models/Persona.js')(sequelize, Sequelize);
db.User = require('../models/User.js')(sequelize, Sequelize);
db.Role = require('../models/Role.js')(sequelize, Sequelize);

db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];
 

// crear roles... en la base directamente
// //function initial() {
//   db.Role.create({
//     id: 1,
//     name: "user"
//   });
 
//   db.Role.create({
//     id: 2,
//     name: "moderator"
//   });
 
//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// //}
module.exports = db;