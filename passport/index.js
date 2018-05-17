const passport = require('passport')
// const LocalStrategy = require('./localStrategy')
const GoogleStratgey = require('./googleStrategy')
const User = require('../models').User;

passport.serializeUser((user, done) => {
    console.log('=== serialize ... called ===')
    console.log(user) // the whole raw user object!
    console.log('---------')
    done(null, { id: user.id })
})

passport.deserializeUser((id, done) => {
    console.log('DEserialize ... called')
    User.findById(id.id)
        .then(user => {
            console.log('======= DESERILAIZE USER CALLED ======')
            console.log(user)
            console.log('--------------')
            done(null, user)
        }).catch(err => {
            console.log(err);
            done(null, false);
        });
    // 	'firstName lastName photos local.username',
    // 	(err, user) => {

    // 	}
    // )
})

// ==== Register Strategies ====
// passport.use(LocalStrategy)
passport.use(GoogleStratgey)

module.exports = passport

