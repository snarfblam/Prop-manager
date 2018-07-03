'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'AppSettings',
            'description',
            {
                type: Sequelize.DataTypes.STRING,
                defaultValue: ''
            }
        );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('AppSettings', 'description');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
