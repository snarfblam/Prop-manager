module.exports = function (sequelize, DataTypes) {
    var AppSetting = sequelize.define("AppSetting", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        }
    });
    return AppSetting;
};
