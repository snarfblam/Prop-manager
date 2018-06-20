const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const GoogleStratgey = require('./googleStrategy')
const User = require('../models').User;

passport.serializeUser((user, done) => {
    done(null, { id: user.id })
})

passport.deserializeUser((id, done) => {
    User.findById(id.id)
        .then(user => {
            return done(null, user)
        }).catch(err => {
            console.log(err);
            return done(null, false);
        });
})

// ==== Register Strategies ====
passport.use(LocalStrategy)
passport.use(GoogleStratgey)

module.exports = passport

