/*
    Implements tenant operations for the TSP API.
*/

/// Modules //////////////////////////////////////////////////////////
const db = require('../models');
const requirements = require('./requirements');


/// Operations ///////////////////////////////////////////////////////
module.exports = {

    PostMaintenanceRequest: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            return user.getUnits().then(units => {
                if (units.length == 0) throw Error("User not associated with a unit.");

                var data = {
                    message: params.message,
                    UnitId: units[0].id,
                };
                return db.Maintenance.create(data);
            }).then(model => {
                return model.get({ plain: true });
                }).catch(err => {
                    console.log(err);
                    throw Error('Could not create maintenace item: ' + err.message);
            });
        }
    },

    GetOwnMaintenanceRequests: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            // Get all user's associated units
            return user.getUnits().then(units => {
                // Get all maint items for each associated unit
                return Promise.all(units.map(unit => 
                    db.Maintenance.findAll({ where: { UnitId: unit.id } })
                ));
            }).then(maintArrays => {
                // Combine the maint requests for each unit into a single array
                return Array.prototype.concat.apply([], maintArrays);
            })
        }
    },

    GetOwnPayments: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            return getUserPayments(user, {});
        }
    },

    GetOwnDuePayments: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            return getUserPayments(user, { paid: false });
        }
    },

    GetOwnUnits: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            return user.getUnits();
        }
    }

}
 
function getUserPayments(user, where) {
    return user
        .getUnits({ include: [{ model: db.Payment, where: where }] })
        .then(
            // join all units' payment arrays into single array
        units => Array.prototype.concat.apply([],
            units.map(unit => unitToPayments(unit))
        ));
    
    function unitToPayments(unit) {
        return  unit.Payments.map(pmnt =>
            ({
                id: pmnt.id,
                unitId: unit.id,
                paymentId: pmnt.id,
                unitName: unit.unitName,
                amount: pmnt.amount, 
                due: pmnt.due_date,
                paid: pmnt.paid,
            })
        );
    }
}
