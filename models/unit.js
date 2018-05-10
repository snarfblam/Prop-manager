module.exports = function(sequelize, DataTypes) {
  var Unit = sequelize.define("Unit", {
    unitName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: { args: 1,
              msg: "Must have a Unit Name"}
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Unit.associate = function(models) {
    Unit.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    // connecting/ the maintenance aka one to many
    Unit.hasMany(models.Maintenance, {
      onDelete: "cascade"
    });

    // connecting the payment aka one to many
    Unit.hasMany(models.Payment, {
      onDelete: "cascade"
    });

  };
    return Unit;
};
