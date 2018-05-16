module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    fullname: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    role: { // 'admin' or 'tenant'
      allowNull: true,
      type: DataTypes.STRING,
    },
    activationCode: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    authtype: {
      allowNull: true,
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
    phone: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        not: ['[a-z]', 'i']
      }
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    zip: {
      allowNull: true,
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
