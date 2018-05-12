////////////// Modules ////////////////////////
require('dotenv').config()
const Express = require('express');
const path = require('path');
const db = require('./models');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store)

// update the config folder with your un and pw. Make sure the DB is created first before server is running


////////////// Configuration //////////////////
const PORT = process.env.PORT || 3001;
const app = Express();
app.use(Express.urlencoded());
app.use(Express.json());

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

////////////// Routing ////////////////////////
app.use(Express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
    var indexPath = path.join(__dirname, 'client', 'build', 'index.html');
    res.sendfile(indexPath);
});

db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
    });
});