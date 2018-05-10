module.exports = function(sequelize, DataTypes) {
    var Maintenance = sequelize.define("Maintenance", {
    message: {
          allowNull: false,
          type: DataTypes.STRING,
          validate: {
            notEmpty: true
          }
      },
      status: {
        allowNull: false,
        type: DataTypes.BOOLEAN,      
      }
    });
      
    Maintenance.associate = function(models) {
        Maintenance.belongsTo(models.Unit, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    
  return Maintenance;
  
  };