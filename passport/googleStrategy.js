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


const strategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        }).then((userMatch) => {
            // if there is already someone with that googleId
            if (userMatch) {
                return done(null, userMatch)
            } else {
                if (req.session.activationCode) {
                    return User.findOne({
                        where: {
                            activationCode: req.session.activationCode
                        }
                    }).then(userMatch => {
                        if (!userMatch) throw Error("Activation code not valid");
                        userMatch.activationCode = null;
                        userMatch.googleId = id;
                        return userMatch.save();
                    }).then(userMatch => {
                        req.session.activationCode = null;
                        
                        if (userMatch instanceof Error) {
                            return done(userMatch, false);
                        } else {
                            return done(null, userMatch);
                        }

                    })
                } else {
                    return done(Error("The specified google user does not have an associated user account on this site."), false);
                }
                // if no user in our db, create a new user with that googleId
                // console.log('====== PRE SAVE =======')
                // console.log(id)
                // console.log(profile)
                // console.log('====== post save ....')
                // const newGoogleUser = User.create({
                //     'google.googleId': id,
                //     firstName: name.givenName,
                //     lastName: name.familyName,
                //     photos: photos
                // })
                // // save this user
                // newGoogleUser.save((err, savedUser) => {
                //     if (err) {
                //         console.log('Error!! saving the new google user')
                //         console.log(err)
                //         return done(null, false)
                //     } else {
                //         return done(null, savedUser)
                //     }
                // }) // closes newGoogleUser.save
            }
        }).catch(err => {
            console.log('Error!! trying to find user with googleId')
            console.log(err)
            return done(null, false)
        }) // closes User.findONe
    }
)

module.exports = strategy
