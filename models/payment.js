module.exports = function(sequelize, DataTypes) {
    var Payment = sequelize.define("Payment", {
    amount: {
          allowNull: false,
          type: DataTypes.FLOAT,
          validate: {
            notEmpty: true
          }
      },
    paid: {
        allowNull: false,
        type: DataTypes.BOOLEAN,      
      },
    due_date: {
        allowNull: false,
        type: DataTypes.DATE,      
      }
    });
      
    Payment.associate = function(models) {
        Payment.belongsTo(models.Unit, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    
  return Payment;
  
  };