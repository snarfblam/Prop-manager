const User = require('../models').User;
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

const strategy = new LocalStrategy(
	{
		usernameField: 'username', // not necessary, DEFAULT
        passReqToCallback: true,
	},
    function (req, username, password, done) {
		User.findOne({ where: {'local_username': username} }).then(userMatch => {
			
			if (!userMatch) {
				return done(null, false, { message: 'Incorrect username' })
			}

            db.Cred.find({ where: { UserId: userMatch.id } })
                .then(cred => {
                    if(cred) {
                        bcrypt.compare(password, cred.local_password, function(err, matched) {
                            if (err) {
                                console.log(err);
                                done(err, null);
                            } else {
                                if (matched) {
                                    done(null, userMatch)
                                } else {
                                    console.log('non-matching password')
                                    done(Error('invalid username or password'), null); // no error, no user
                                }
                            }
                        });       
                    } else {
                        console.log('credentials not found')
                        done(Error('invalid username or password'), null);
                    }    
                });
			// Load hash from your password DB.


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
