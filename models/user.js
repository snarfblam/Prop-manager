module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    fullname: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    role: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    activationCode: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    authtype: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    local_username: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    local_password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    googleId: {
      allowNull:true,
      type: DataTypes.STRING
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        not: ['[a-z]', 'i']
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    zipcode: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Unit, {
      onDelete: "cascade"
    });
    User.belongsToMany(models.Unit, {
      through: 'User_unit'
    });
  };


return User;

};
