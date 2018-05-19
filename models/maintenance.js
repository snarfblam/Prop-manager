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
          defaultValue: true //true is an open maintenance request and false is a closed maintenance request
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