const User = require('../models').User;
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username', // not necessary, DEFAULT
        passReqToCallback: true,
	},
    function (req, username, password, done) {
        // TODO: validate that this function signature is correct
        throw Error("Before running this code, please verify we are receiving the correct parameters here.");
		User.findOne({ 'local_username': username }).then(userMatch => {
			
			if (!userMatch) {
				return done(null, false, { message: 'Incorrect username' })
			}
			// if (!userMatch.checkPassword(password)) {
			// 	return done(null, false, { message: 'Incorrect password' })
			// }
			return done(null, userMatch)
		}).catch(err => {
			if (err) {
				return done(err)
			}
		})
	}
)

module.exports = strategy
