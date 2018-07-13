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
        execute: (user, params) => {
            return db.Maintenance.findById(params.id)
                .then(
                    maintItem => maintItem.updateAttributes({ status: params.status })
                );
                
        }
    },

    GetAllMaintenanceRequests: {
        requirements: [requirements.admin],
        execute: (user, params) => {
            return db.Maintenance.findAll({
                where: params.where || {},
                include: [db.Unit],
            })
        }
    },

    GetAllPayments: {
        requirements: [requirements.admin],
        execute: (user, params) => {
            return db.Payment.findAll({
                where: params.where || {},
                include: [db.Unit],
            });
        }
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
}