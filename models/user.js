var model = require('../util/model');

module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define("User",
        model([
            "fullname           STRING  required notEmpty",
            "role               STRING  required notEmpty",
            "activationCode     STRING  nullable",
            "authtype           STRING  nullable",
            "local_username     STRING  nullable",
            "googleId           STRING  nullable",
            "phone              STRING ", { validate: { not: ['[a-z]', 'i'] } },
            "email              STRING  unique", { validate: { isEmail: true } },
            "address            STRING  nullable",
            "city               STRING  nullable notEmpty",
            "state              STRING  nullable notEmpty",
            "zip                STRING  nullable notEmpty",
            "stripeCustToken    STRING  nullable",
            "stripeACHToken     STRING  nullable",
            "stripeACHVerified  BOOLEAN required", {defaultValue: false},
        ])
        // {
        //     fullname: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         validate: {
        //             notEmpty: true
        //         }
        //     },
        //     role: { // 'admin' or 'tenant'
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     activationCode: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     authtype: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     local_username: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     googleId: {
        //         allowNull: true,
        //         type: DataTypes.STRING
        //     },
        //     phone: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         validate: {
        //             not: ['[a-z]', 'i']
        //         }
        //     },
        //     email: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         unique: true,
        //         validate: {
        //             isEmail: true
        //         }
        //     },
        //     address: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         validate: {
        //             notEmpty: true
        //         }
        //     },
        //     city: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         validate: {
        //             notEmpty: true
        //         }
        //     },
        //     state: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //         validate: {
        //             notEmpty: true
        //         }
        //     },
        //     zip: {
        //         allowNull: true,
        //         type: DataTypes.INTEGER,
        //         validate: {
        //             notEmpty: true
        //         }
        //     },
        //     stripeCustToken: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     stripeACHToken: {
        //         allowNull: true,
        //         type: DataTypes.STRING,
        //     },
        //     stripeACHVerified: {
        //         allowNull: false,
        //         type: DataTypes.BOOLEAN,
        //         defaultValue: false,
        //     },

        // }
    );

    User.associate = function (models) {
        User.belongsToMany(models.Unit, {
            through: 'User_unit'
        });
    };



    /**
     *  Returns a boolean indicating whether this account has any credentials associated with it
     */
    User.prototype.hasCredentials = function () {
        return !!(this.googleId || this.local_username);
    }

    return User;

};

