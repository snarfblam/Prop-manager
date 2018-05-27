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
const appSettings = require('./appSettings');
// const enforce = require('express-sslify');


const invoiceJob = require('./cron/invoiceGenerator');

// update the config folder with your un and pw. Make sure the DB is created first before server is running
global.db = db;


////////////// Configuration //////////////////
const PORT = process.env.PORT || 3001;
const app = express();

//Enforce HTTPS/SSL
if (process.env.NODE_ENV == 'production') {
    app.use(require('express-sslify').HTTPS({ trustProtoHeader: true }));
}

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

// Don't clear database in production. Seems important.
var syncOption = (process.env.NODE_ENV == 'production') ? {} : { force: true };

db.sequelize.sync(
    syncOption
).then(() => {
    // Generate default user(s) and settings, when applicable
    return Promise.all([
        generateDatabaseSeed(),
        appSettings.init(),
    ]);
}).then(() => {
    invoiceJob.schedule();    
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
//``
    app.use(passport.initialize())
    app.use(passport.session()) // will call the deserializeUser
    app.use(apiRoutes)

}).then(() => {
    ////////////// Routing ////////////////////////
    app.use('/auth', require('./routes/auth'));
    app.use('/static', express.static(path.join(__dirname, 'client', 'build', 'static')));
    app.use('/img', express.static(path.join(__dirname, 'client', 'build', 'img')));
    app.get('*', (req, res) => {
        var indexPath = path.join(__dirname, 'client', 'build', 'index.html');
        res.sendfile(indexPath);

    });

    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
    });
});







/** Seeds the database when applicable. Returns a promise that resolves when the operation is complete. */
function generateDatabaseSeed() {
    if (process.env.NODE_ENV == 'production') {
        return db.User.count()
            .then(count => {
                if (count > 0) return Promise.resolve();
                return db.User.create({
                    fullname: "Administrator",
                    role: "admin",
                    activationCode: "admin",
                    authtype: null,
                    local_username: null,
                    local_password: null,
                    googleId: null,
                    phone: "000-000-0000",
                    email: "none@none.com",
                    address: "none",
                    city: "none",
                    state: "CA",
                    zip: 90210,
                });
            })
        
    }

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
        amount: 450,
        paid: false,
        due_date: '2018-04-17 00:58:52',
        UnitId: 1
    });
    var newPaymentPromise2 = db.Payment.create({
        amount: 500,
        paid: false,
        due_date: '2018-04-17 00:58:52',
        UnitId: 1
    });

    return Promise
        .all([newUnitPromise, newAdminPromise, newTenantPromise, newPaymentPromise])
        .then(([newUnit, newAdmin, newTenant, newPayment]) => {
            newUnit.addUsers([newAdmin, newTenant]);
            // newAdmin.addUnit(newUnit).then(()=>
            //     newTenant.addUnit(newUnit))
        });
    
}
