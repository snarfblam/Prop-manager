////////////// Modules ////////////////////////
require('dotenv').config()
const Express = require('express');
const path = require('path');
const db = require('./models');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store)
const cookieParser = require('cookie-parser');
const passport = require('./passport')

// update the config folder with your un and pw. Make sure the DB is created first before server is running



////////////// Configuration //////////////////
const PORT = process.env.PORT || 3001;
const app = Express();
app.use(Express.urlencoded());
app.use(Express.json());
app.use(cookieParser());

db.sequelize.sync({ force: true }).then(function () {
    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
    });
}).then(() => {
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

    app.use(passport.initialize())
    app.use(passport.session()) // will call the deserializeUser
})



////////////// Routing ////////////////////////
app.use('/auth', require('./auth'));
app.use(Express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
    var indexPath = path.join(__dirname, 'client', 'build', 'index.html');
    res.sendfile(indexPath);
});
