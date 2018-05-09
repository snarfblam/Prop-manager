module.exports = function(sequelize, DataTypes) {
  var Service = sequelize.define("Service", {
    unitnumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      len: { args: 1,
              msg: "Must have a Categoy Name"}
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: { args: 1,
              msg: "Must have a Business Name"}
    },
    businessService: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    costOfService: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Service.associate = function(models) {
    Service.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
    return Unit;
};
