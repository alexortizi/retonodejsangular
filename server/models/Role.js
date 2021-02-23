module.exports = (sequelize, type) => {
  const Role = sequelize.define("roles", {
    id: {
      type: type.INTEGER,
      primaryKey: true
    },
    name: {
      type: type.STRING,
      validate:{
        notEmpty: true
      }
    }
  });

  return Role;
};
