var sequelize = require('sequelize');

/*
    Allows definition of a sequelize model in a far more sane syntax.
    One column per field.

    'definition' should be an array containing strings where each string
    describes a column in the syntax outlined below. Additionally, an object
    may follow a string in the array and provide additional properties to be
    applied to the column in the model definition, e.g. {validate: 
    {notEmpty: true}}. 
*/

// name {type} [nullable | required] [unique] [notempty] [default: {json}]

// var typeNames = ['STRING', 'INTEGER', 'BOOLEAN'];
// var typeDefs = [sequelize.STRING, sequelize.INTEGER, sequelize.BOOLEAN];
var typeDefs = {
    STRING: sequelize.STRING,
    INTEGER: sequelize.INTEGER,
    BOOLEAN: sequelize.BOOLEAN,
    FLOAT: sequelize.FLOAT,
    DATE: sequelize.DATE,
}

var columnMods = {
    nullable: function (obj) {
        if (obj.allowNull) throw Error("Nullability of column specified multiple times.");

        obj.allowNull = true;
    },
    required: function (obj) {
        if (obj.allowNull) throw Error("Nullability of column specified multiple times.");

        obj.allowNull = false;
    },
    notempty: function (obj) {
        if (!obj.validate) obj.validate = {};
        obj.validate.notEmpty = true;
    },
    unique: function (obj) {
        if (obj.unique) throw Error("Unique for column specified multiple times.");

        obj.unique = true;
    }
}

function model(definition) {
    var model = {};

    if (!definition.length) throw Error("definition should be an array");

    for (var i = 0; i < definition.length; i++) {
        var column = {};

        // Split words out, remove empty spaces
        if (typeof (definition[i]) !== 'string') throw Error("Column definition must be a string");
        var columnDef = definition[i].split(' ').filter(i => i); 
        if (columnDef.length < 2) throw Error("Model definition entry missing either name or type");

        // Name and type
        var colName = columnDef[0];
        var typeName = columnDef[1];
        column.type = typeDefs[typeName.toUpperCase()];
        if (column.type == undefined) throw Error("Unknown column type:" + typeName);

        // Keywords
        for (var iColPart = 2; iColPart < columnDef.length; iColPart++) {
            var mod = columnMods[columnDef[iColPart].toLowerCase()];
            if (!mod) throw Error("Unknown keyword: " + columnDef[iColPart]);

            mod(column);
        }

        // Trailing object
        var nextItem = definition[i + 1];
        if (typeof nextItem == 'object') {
            i++; // don't parse this element as a column
            
            // Copy properties to column object
            for (var key in nextItem) {
                column[key] = nextItem[key];
            }
        }

        model[colName] = column;
    }

    return model;
    
}

module.exports = model;