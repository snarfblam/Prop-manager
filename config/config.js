var path = require('path');

module.exports = {
    "development": {
        "username": process.env.DB_UNAME,
        "password": process.env.DB_PASSWD,
        "database": "propsmanager",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.DB_UNAME,
        "password": process.env.DB_PASSWD,
        "database": "propsmanager",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}