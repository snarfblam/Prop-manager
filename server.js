////////////// Modules ////////////////////////
require('dotenv').config()
const moment = require('moment');
moment().format();
const cron = require('node-cron');
const express = require('express');
const path = require('path');
const db = require('./models');
const apiRoutes = require('./routes/apiRoutes');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store)
const cookieParser = require('cookie-parser');
const passport = require('./passport')

// update the config folder with your un and pw. Make sure the DB is created first before server is running
global.db = db;


////////////// Configuration //////////////////
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

db.sequelize.sync({
    force: true
}).then(() => {
    var newUnitPromise = db.Unit.create({
        unitName: "Big Office",
        rate: 90
    });
    var newAdminPromise = db.User.create({
        fullname: "admin j. user",
        role: "admin",
        activationCode: "admin",
        authtype: null,
        local_username: null,
        local_password: null,
        googleId: null,
        phone: "000-000-0000",
        email: "fake@web.com",
        address: "none",
        city: "none",
        state: "CA",
        zip: 90210,
    });
    var newTenantPromise = db.User.create({
        fullname: "Freddy McTenant",
        role: "tenant",
        activationCode: "tenant",
        authtype: null,
        local_username: null,
        local_password: null,
        googleId: null,
        phone: "000-000-0000",
        email: "fake@mail.com",
        address: "none",
        city: "none",
        state: "CA",
        zip: 90210,
    });
    var newPaymentPromise = db.Payment.create({
        amount: 500,
        paid: true,
        due_date: '2018-05-17 00:58:52',
        UnitId: 1
    });
    var newPaymentPromise2 = db.Payment.create({
        amount: 500,
        paid: false,
        due_date: '2018-05-17 00:58:52',
        UnitId: 1
    });

    Promise
        .all([newUnitPromise, newAdminPromise, newTenantPromise, newPaymentPromise])
        .then(([newUnit, newAdmin, newTenant, newPayment]) => {
            newUnit.addUsers([newAdmin, newTenant]);
            // newAdmin.addUnit(newUnit).then(()=>
            //     newTenant.addUnit(newUnit))
        }).then(() => {
            cron.schedule('0-59 * * * *', function(){
                console.log('running a task every minute');
                db.Unit
                .findAll({})
                .then(units => {
                    let timeOfTheMos = moment(moment().format("YYYY-MM")).format("YYYY-MM-DD HH:mm:ss.SSS");
                    console.log(timeOfTheMos);
                    units.map(unit => {
                        db.Payment.findOrCreate({
                            where: {
                                id: unit.id,
                                due_date: {$gte: timeOfTheMos}
                            },
                            defaults: {
                                UnitId: unit.id, 
                                paid: false,
                                amount: 500,
                                due_date: timeOfTheMos
                            }
                        }).spread((payRec, created) => {
                            console.log(payRec.get({
                                plain: true
                            }))
                            if(created){
                                console.log(`Payment Record created. Due date: ${timeOfTheMos} Unit: ${unit.id}`)
                            } else {
                                console.log(`Payment Record was prviously created for Unit: ${unit.id}`)
                            }
                        })

                    })
                }).catch(console.error)
            });
        });

    const sequelizeSessionStore = new SessionStore({
        db: db.sequelize,
    });
    // app.use(cookieParser());
    app.use(expressSession({
        secret: 'a whop bop baloobop.',
        store: sequelizeSessionStore,
        resave: false,
        saveUninitialized: false,
    }));
``
    app.use(passport.initialize())
    app.use(passport.session()) // will call the deserializeUser
    app.use(apiRoutes)

}).then(() => {
    ////////////// Routing ////////////////////////
    app.use('/auth', require('./auth'));
    app.use('/static', express.static(path.join(__dirname, 'client', 'build', 'static')));
    app.get('*', (req, res) => {
        var indexPath = path.join(__dirname, 'client', 'build', 'index.html');
        res.sendfile(indexPath);

    });

    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
    });
});
