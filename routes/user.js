/*
    Implements user operations for the TSP API.
*/


/// Modules //////////////////////////////////////////////////////////
const db = require('../models');
const requirements = require('./requirements');
const uuidv1 = require('uuid/v1');
const mailer = require('../mail/emailActivation');
const appSettings = require('../appSettings');

/// Operations ///////////////////////////////////////////////////////
module.exports = {
    SubmitActivationCode: {
        requirements: [requirements.unlogged],
        execute: (user, params, req) => {
            if (!params.activationCode) throw 'Activation code not specified';

            return db.User.findOne({ where: { activationCode: params.activationCode } })
                .then(matchedUser => {
                    if (!matchedUser) {
                        req.session.activationCode = null;
                        throw 'Activation code invalid';
                    }

                    // If the user already has credentials he is performing a password reset and ui should act accordingly.
                    var accountStatus = 'new';
                    if (matchedUser.hasCredentials()) {
                        accountStatus = matchedUser.local_username ? 'local reset' : 'full reset';
                    }
    
                    req.session.activationCode = params.activationCode;
                    return {
                        result: 'success',
                        accountStatus: accountStatus,
                    };
                });
                
        }
    },

    GetUserStatus: {
        requirements: [],
        execute: (user, params, req) => {
            if (!user) {
                return Promise.resolve({
                    status: 'logged out',
                    appTitle: appSettings.getSetting('appTitle'),
                    bannerText: appSettings.getSetting('bannerText'),
                });
            }

            var role = user.role || 'tenant'; // assume the most restrictive account type if not present
            return Promise.resolve({
                status: role,
                email: user.email,
                stripeToken: user.stripeCustToken,
                stripeACHVerified: user.stripeACHVerified,
                authtype: user.authtype,
                appTitle: appSettings.getSetting('appTitle'),
                bannerText: appSettings.getSetting('bannerText'),
                stripeApiKey: appSettings.getSetting('stripeApiKey'),
            });
        }
    },

    ResetUser: {
        requirements: [],
        execute: (user, params, req) => {
            if (!params.username) throw 'Missing username';
    
            return db.User
                .findOne({ where: { local_username: req.username } })
                .then(foundUser => {
                    if (!foundUser) {
                        return 'not found';
                    } else if (foundUser.activationCode) {
                        return 'reset pending';
                    } else {
                        var activation = uuidv1();
                        return foundUser
                            .update({ activationCode: activation })
                            .then(() => mailer.sendPasswordReset(data))
                            .then(() => 'reset');
                    }
                });
        }
    },
};
