const cron = require('node-cron');
const db = require('../models');

/**
 * Schedules the invoice generator
 */
function schedule() {
    return cron.schedule('0-59 * * * *', function () {
        
        db.Unit
            .findAll({})
            .then(units => {
                let timeOfTheMos = moment(moment().format("YYYY-MM")).format("YYYY-MM-DD HH:mm:ss.SSS");
                console.log(timeOfTheMos);
                units.map(unit => {
                    db.Payment.findOrCreate({
                        where: {
                            id: unit.id,
                            due_date: { $gte: timeOfTheMos }
                        },
                        defaults: {
                            UnitId: unit.id,
                            paid: false,
                            amount: unit.rate,
                            due_date: timeOfTheMos
                        }
                    }).spread((payRec, created) => {
                        console.log(payRec.get({
                            plain: true
                        }))
                        if (created) {
                            console.log(`Payment Record created. Due date: ${timeOfTheMos} Unit: ${unit.id}`)
                        } else {
                            console.log(`Payment Record was prviously created for Unit: ${unit.id}`)
                        }
                    })

                })
            }).catch(console.error)
    });
}

module.exports = { schedule: schedule };