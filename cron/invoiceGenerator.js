const cron = require('node-cron');
const db = require('../models');
const moment = require('moment');

/**
 * Schedules the invoice generator
 */
function schedule() {
    return cron.schedule('0-59 * * * *', function () {
        
        db.Unit
            .findAll({})
            .then(units => {
                if (!units || units.length == 0) return;

                let timeOfTheMos = moment(moment().format("YYYY-MM")).format("YYYY-MM-DD HH:mm:ss.SSS");
                // console.log(timeOfTheMos);
                units.map(unit => {
                    if (unit.rate) { // Don't create payments for units with a rate of 0
                        db.Payment.findOrCreate({
                            where: {
                                UnitId: unit.id,
                                due_date: { $gte: timeOfTheMos }
                            },
                            defaults: {
                                UnitId: unit.id,
                                paid: false,
                                amount: unit.rate,
                                due_date: timeOfTheMos
                            }
                        }).spread((payRec, created) => {
                            if (created) {
                                console.log(`Payment Record created. Due date: ${timeOfTheMos} Unit: ${unit.id}.`, payRec.get({ plain: true }));
                                // } else {
                                //     console.log(`Payment Record was prviously created for Unit: ${unit.id}`)
                            }
                        })

                    }
                });
            }).catch(console.error)
    });
}

module.exports = { schedule: schedule };