var model = require('../util/model');

module.exports = function (sequelize, DataTypes) {
    var Payment = sequelize.define("Payment",
        model([
            "amount     FLOAT    required notEmpty",
            "paid       BOOLEAN  required",
            "due_date   DATE     required",
        ])
    // {
    // amount: {
    //       allowNull: false,
    //       type: DataTypes.FLOAT,
    //       validate: {
    //         notEmpty: true
    //       }
    //   },
    // paid: {
    //     allowNull: false,
    //     type: DataTypes.BOOLEAN,      
    //   },
    // due_date: {
    //     allowNull: false,
    //     type: DataTypes.DATE,      
    //   }
    // }
    );
      
    Payment.associate = function(models) {
        Payment.belongsTo(models.Unit, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    
  return Payment;
  
  };