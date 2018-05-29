module.exports = function(sequelize, DataTypes) {

    var Cred = sequelize.define("Cred", {
        local_password: {
            type: DataTypes.STRING,
            allowNull: false,
            len: { args: 1,
            msg: "Must have a Password"}
        }
    
    });
    Cred.associate = function(models) {
    
        Cred.belongsTo(models.User);
    };
    return Cred;

}