/*
    Google login and account activation

    This file contains logic to both
    - log in users that have associated google credentials
    - activate user accounts by associating them with google credentials

    Contrary to the design of the application this code is based on,
    this auth strategy can NOT be used to create new accounts.

    Account activation logic:
        - Prior to authenticating, the user must visit a url provided by an
          administrator. The page served will access an API endpoint which
          assigns the user's session.activationCode property.
        - When a user authenticates, if his session data contains an activationCode:
            - An existing user record must be present with a corresponding activationCode
                - If no such record is found, the user must be logged out and provided
                  with an error message
            - This user record is modified to:
                - Add the google ID provided by the authentication
                - Remove the activation code
            - This user record is returned to be used as the session.user object.
              I.e. the user is now logged in, and his account his now associated with
              his google credentials
*/

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../models').User;
const appSettings = require('../appSettings');


const strategy = new GoogleStrategy(
    {
        clientID: appSettings.getSetting('GOOGLE_CLIENT_ID'),
        clientSecret: appSettings.getSetting('GOOGLE_CLIENT_SECRET'),
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
    },
    function (req, token, tokenSecret, profile, done) {
        // testing
        console.log('===== GOOGLE PROFILE =======')
        console.log(profile)
        console.log('======== END ===========')
        // code
        const { id, name, photos } = profile
        User.findOne({
            where: {
                googleId: id
            }
        }).then((googleMatch) => {
            if (req.session.activationCode) {
                return User.findOne({
                    where: {
                        activationCode: req.session.activationCode
                    }
                }).then(activationMatch => {
                    if (!activationMatch) {
                        throw Error("Activation code not valid");
                        req.session.activationCode = null;
                    }

                    // activationMatch.activationCode = null;
                    // activationMatch.googleId = id;
                    // return activationMatch.save();
                    return assignGoogleId(activationMatch, id);
                }).then(activationMatch => {
                    req.session.activationCode = null;
                        
                    if (activationMatch instanceof Error) {
                        return done(activationMatch, false);
                    } else {
                        return done(null, activationMatch);
                    }

                })
            } else if (googleMatch) {
                return done(null, googleMatch)
            } else {
                return done(Error("The specified google user does not have an associated user account on this site."), false);
            }
        }).catch(err => {
            console.log('Error!! trying to find user with googleId')
            console.log(err)
            return done(null, false)
        }) // closes User.findONe
    }
)

// Returns a promise that resolves when the user's credentials are updated
function assignGoogleId(user, googleId) {
    user.googleId = googleId;
    user.activationCode = null;
    user.local_username = null;

    return Promise.all([
        // Remove password
        db.Cred.destroy({ where: { UserId: user.id } }),
        // Save user
        user.save()
    ]).then(resultArray => resultArray[1]); // Return user model
}

module.exports = strategy
