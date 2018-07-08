var model = require('../util/model');

module.exports = function (sequelize, DataTypes) {
    var AppSetting = sequelize.define("AppSetting",
        model([
            "name         STRING  required unique",
            "value        STRING  required", { defaultValue: ' ' },
            "description  STRING  required", { defaultValue: ' ' },
        ])
        // {
        // name: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     unique: true,
        // },
        // value: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: '',
        // },
        // description: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     defaultValue: '',
        // }
        // }
    );
    return AppSetting;
};
