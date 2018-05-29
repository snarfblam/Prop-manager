const express = require('express')
var bcrypt = require('bcrypt');
const router = express.Router()
// const User = require('../db/models/user')
const passport = require('../../passport')

var googleAuthHandler = passport.authenticate('google', { scope: ['profile'] });
router.get('/google', (req, res, next) => {
    null;
    googleAuthHandler(req, res, next);
});
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/logerr'
	})
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
	console.log('===== user!!======')
	console.log(req.user)
	if (req.user) {
		return res.json({ user: req.user })
	} else {
		return res.json({ user: null })
	}
})

router.post(
	'/login',
	function(req, res, next) {
		console.log('login:', req.body)
		console.log('================')
		next()
    },
	passport.authenticate('local'),
	(req, res) => {
        console.log('POST to /login')
		const user = JSON.parse(JSON.stringify(req.user)) // hack
		const cleanUser = Object.assign({}, user)
		if (cleanUser.local) {
			console.log(`Deleting ${cleanUser.local_password}`)
			delete cleanUser.local_password
		}
		res.json({ user: cleanUser })
	}
)

router.post('/logout', (req, res) => {
	if (req.user) {
		req.session.destroy()
		res.clearCookie('connect.sid') // clean up!
		return res.json({ msg: 'logging you out' })
	} else {
		return res.json({ msg: 'no user to log out!' })
	}
})

router.post('/signup', (req, res) => {
	
	const username = req.body.username;
	const password = req.body.password;
	// ADD VALIDATION
    db.User.findOne({ where: {activationCode: req.session.activationCode} }).then(userMatch => {
        if (userMatch) {
			console.log(username);
            db.User.findOne({where: {local_username: username} }).then(usernameMatch => {
                if (usernameMatch) {
                    // duplicate
                    res.json({ result: 'duplicate' });
                } else {
					//hashing PW COME BACK TO :)

					const saltRounds = 10;

					bcrypt.hash(password, saltRounds, function(err, hash) {
						// Store hash in your password DB.
                        userMatch.updateAttributes({
                            local_username: username,
                            // local_password: password,
                            activationCode: null,
                        });
                        db.Cred.create({ local_password: hash })
                            .then(cred => {
                                cred.setUser(userMatch);
                                res.json({ result: 'success' });
                        });
					  });
					
            
                }
            })
            
        } else {
            res.json({ result: "not found" }) // activation code not found
        }
    }).catch(err => {
        console.error(err);
        res.status(500).end();
    });
})

module.exports = router
