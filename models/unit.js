module.exports = function(sequelize, DataTypes) {
  var Unit = sequelize.define("Unit", {
    unitName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: { args: 1,
              msg: "Must have a Unit Name"}
    },
    rate: { // Rate of 0 means invoices will not be generated
      type: DataTypes.INTEGER,
      allowNull: true //please change back to false
    }
  });
  Unit.associate = function(models) {
    // Unit.hasMany(models.User, {
    //   foreignKey: {
    //     allowNull: true //please change back to false
    //   }
    // });

    // connecting/ the maintenance aka one to many
    Unit.hasMany(models.Maintenance, {
    //   onDelete: "cascade"
    });

    // connecting the payment aka one to many
    Unit.hasMany(models.Payment, {
    //   onDelete: "cascade"
    });

    Unit.belongsToMany(models.User, {
      through: 'User_unit'
    });

  };
    return Unit;
};
