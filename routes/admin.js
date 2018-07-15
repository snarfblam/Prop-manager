/*
    Implements admin operations for the TSP API.
*/


/// Modules //////////////////////////////////////////////////////////
const db = require('../models');
const requirements = require('./requirements');
const uuidv1 = require('uuid/v1');
const mailer = require('../mail/emailActivation')


/// Operations ///////////////////////////////////////////////////////
module.exports = {
    ChangeMaintenanceStatus: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.Maintenance.findById(params.id)
                .then(
                    maintItem => maintItem.updateAttributes({ status: params.status })
                )
    },

    GetAllMaintenanceRequests: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.Maintenance.findAll({
                where: params.where || {},
                include: [db.Unit],
            })
    },

    GetAllPayments: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.Payment.findAll({
                where: params.where || {},
                include: [db.Unit],
            })
    },

    CreateUser: {
        requirements: [requirements.admin],
        execute: (user, params) => {
            var modelData = params;
            modelData.activationCode = uuidv1();
            modelData.UnitId = params.unit;
            modelData.role = modelData.role || 'tenant';
 

            var unit;
            return db.Unit.findOne({
                where: { id: params.unit }
            }).then(foundUnit => {
                if (!foundUnit) throw Error('Specified unit not found');

                unit = foundUnit;
                return db.User.create(modelData);
            }).then(userModel => {
                mailer.sendInv(userModel).catch(console.error); // non-fatal

                return unit.setUsers([userModel])
                    .then(() => userModel);
            });
        }
    },

    GetUserList: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.User.findAll()
                .then(
                    // Convert each user to a plain object
                    userList => userList.map(
                        userModel => {
                            var plain = userModel.get({ plain: true });
                            plain.authtype = getAuthType(userModel);
                            return plain;
                        }
                    )
                )
    },

    GetUnitList: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.Unit.findAll({ include: [db.User] })
                .then(unitList =>
                    // convert each unit to a plain object
                    unitList.map(unitModel => {
                        var plain = unitModel.get({ plain: true });
                        // convert each user to simply {id, fullname}
                        plain.users = unitModel.Users.map(
                            userModel => ({
                                id: userModel.id,
                                fullname: userModel.fullname,
                            })
                        );
                        return plain;
                    })
                )
    },

    CreateUnit: {
        requirements: [requirements.admin],
        execute: (user, params) => {
            var userList, unitModel;

            // We want to make sure all users were found before attempting to 
            return Promise.all(
                // Get all users specified by the request
                params.users.map(
                    userId => db.User.findById(userId)
                )
            ).then(foundUsers => {
                // Validate query result
                userList = foundUsers;
                var anyNulls = userList.some(userModel => userModel == null);
                if (anyNulls) throw Error('Invalid user ID specified');

                // Create unit
                return db.Unit.create({
                    unitName: params.unitName,
                    rate: params.rate
                });
            }).then(newUnit => {
                // Associate with users
                unitModel = newUnit;

                return unitModel.addUsers(userList);
            }).then(() => ({ id: unitModel.id }));
        }
    },

    EditUnit: {
        requirements: [requirements.admin],
        execute: (user, params) => {
            var values = {};
            if (params.unitName) values.unitName = params.unitName;
            if (params.rate) values.rate = params.rate;
            if (params.users) values.UserIds = params.users;

            var unit;
            return db.Unit
                .findById(params.id)
                .then(foundUnit => {
                    if (foundUnit == null) throw Error('unit not found');
                    unit = foundUnit;
                    return unit.update(values);
                }).then(foundUnit => {
                    if (params.users) {
                        return unit.setUsers(params.users);
                    }
                }).then(() => {
                    return { id: params.id };
                });
        }
    }
}

function getAuthType(userModel) {
    if (userModel.googleId) return 'google';
    if (userModel.local_username) return 'local';
    return 'other';
}