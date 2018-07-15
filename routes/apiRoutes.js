const express = require('express');
const db = require('../models');
const uuidv1 = require('uuid/v1');
require("dotenv").config();
const keys = require("../keys.js");
const stripeKeys = keys.Stripe;
const keyPublishable = stripeKeys.PUBLISHABLE_KEY;
const keySecret = stripeKeys.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const appSettings = require('../appSettings');
const emailSnd = require('../mail/emailActivation')
const api = require('./api');

var router = express.Router();

router.post('/api/tsp', (req, res, next) => {
    api.processRequest(req, res, next);
})

{ // Maintenance Requests
    // POST - Post a maintenance request to the database
    // router.post('/api/postMaintRequest', (req, res, next) => {
    //     var data = req.body;
    //     req.user.getUnits()
    //         .then(function (dbUnits) {
    //             data.UnitId = dbUnits[0].id;
    //             db.Maintenance.create(data).then(function (dbMaint) {
    //                 res.json(dbMaint)
    //             })
    //         }).catch(console.log);
    // });

    // POST - Mark a maintenance request as completed
    // router.post('/api/changeStatusMaintRequest', (req, res, next) => {
        
    //     db.Maintenance.findById(req.body.id).then(function(dbMaint){
    //         if(dbMaint) {
    //             dbMaint.updateAttributes({
    //                 status:  req.body.status    // false means closed || true means open
    //             })
    //         }
    //         res.sendStatus(200)
    //     }).catch(function(error) {
    //         if(error) throw error;
    //     })
    // });

    // // GET - User gets all of their maintenance requests
    // router.get('/api/getOwnMaintRequest', (req, res, next) => {
    //     req.user.getUnits().then(function(dbUnits) {            
    //         db.Maintenance.findAll({
    //             where: {
    //                 UnitId: dbUnits[0].id
    //             }
    //         }).then(function(dbMaint) {
    //             res.json(dbMaint)
    //         }) 
    //     })
    // });

    // POST -  Admin gets all of the maintenance requests that are open
    /* Request body: {
        where?: {status?: boolean} // status = true for open maint requests
    }
    */
    // router.post('/api/getAllMaintRequests', (req, res, next) => {
    //     // Only allowed for logged-in admins
    //     if (!req.user || req.user.role != 'admin') {
    //         return res.status(403).end();
    //     }
        
    //     var where = (req.body || {}).where || {};

    //     db.Maintenance.findAll({
    //         where: where,
    //         include: [db.Unit],
    //     }).then(function(dbMaint) {
    //         res.json(dbMaint)
    //     }).catch(err => {
    //         res.status(500).end();
    //         console.log(err);
    //     });
    // });
}

{ // Payments
    // POST - submits payment to stripe from tenant page
    //Creates the Strip modal for Credit card transaction that takes the card and email for from the person making the payment
    router.post('/api/submitPayment', (req, res, next) => {

        var invoiceList = req.body.invoiceList || [];

        db.Payment.findAll({
            where: {
                id: invoiceList,
                paid: false
            }
        }).then(payments => {
            var totalDollars = payments.reduce((sum, pmt) => sum + pmt.amount, 0);
            var totalCents = totalDollars * 100;

            if (totalCents === 0) {
                return res.json({ status: 'zero payment' });
            };

            // stripe.customers.create({
            //     email: req.body.email,
            //     card: req.body.id,
            getStripeCustomer(req, req.body.email, req.body.id)
            .then(customer =>
                stripe.charges.create({
                    amount: totalCents,
                    description: "Rent Payment",
                    currency: "usd",
                    customer: customer.id,
                    receipt_email: req.body.email,
                })
            ).then(charge => {
                console.log("successful payment");
                res.send({
                    amount: charge.amount,
                    status: charge.status,
                    paid: charge.paid,
                    currency: charge.currency,
                    description: charge.description,
                })

                // Mark all specified invoices as paid
                db.Payment.update({ paid: true }, { where: { id: invoiceList } })
                    .then(console.log) // log updated rows
                    .catch(console.log) // log errors
            }).catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" });
            });
        });
    });


    function getStripeCustomer(request, email, card) {
        var user = request.user;
        if (!user) throw Error('User not logged in');

        if (user.stripeCustToken) {
            return stripe.customers.retrieve(user.stripeCustToken);
        } else {
            return stripe.customers.create({
                email: email,
                card: card
            }).then(customer => {
                user.update({
                    stripeCustToken: customer.id
                }).catch(err => console.error);

                return customer;
            });
        }

        return 
    }

        // POST - Mark a payment request as paid
        router.post('/api/markPaid', (req, res, next) => {
            if (!req.user || req.user.role != 'admin') return res.status(403).end();

            db.Payment.findById(req.body.id).then(function(payment){
                if(payment) {
                    payment.updateAttributes({
                        paid: true,
                    })
                }
                res.sendStatus(200)
            }).catch(function(error) {
                if(error) throw error;
            })
        });
   
//    router.get('/api/getOwnUnitPayments', (req, res, next) => {
//         return getUserPayments(req, res, {  });
//    });
    
//     router.get('/api/rentAmount', (req, res, next) => {
//         return getUserPayments(req, res, { paid: false });
//     });

    // function getUserPayments(req, res, where) {
    //     if (req.user) {
    //         req.user
    //             .getUnits({ include: [{ model: db.Payment, where: where }] })
    //             .then(units => {
    //                 var results = [];

    //                 units.forEach(unit => {
    //                     unit.Payments.forEach(payment => {
    //                         results.push({
    //                             id: payment.id,
    //                             unitId: unit.id,
    //                             paymentId: payment.id,
    //                             unitName: unit.unitName,
    //                             amount: payment.amount,
    //                             due: payment.due_date,
    //                             paid: payment.paid,
    //                         });
    //                     });
    //                 });
    //                 res.json(results);
    //             });
    //     } else {
    //         res.json([]); // whole lotta nuffin
    //     }
    // }

    // GET - gets the tenant’s payment history
    router.get('/api/paymentHistory', (req, res, next) => {

    });

    // POST - gets all of the payment history for the admin
    /* Request body: {
           where?: {paid?: boolean} 
       }
    */
    // router.post('/api/allPayments', (req, res, next) => {
    //     // Only allowed for logged-in admins
    //     if (!req.user || req.user.role != 'admin') {
    //         return res.status(403).end();
    //     }
        
    //     var where = (req.body || {}).where || {};

    //     db.Payment.findAll({
    //         where: where,
    //         include: [db.Unit],
    //     }).then(payments => {
    //         res.json(payments);
    //     }).catch(err => {
    //         res.status(500).end();
    //         console.log(err);
    //     });
    // });

    router.post('/api/payACH', (req, res, next) => {
        if(!req.user.stripeACHToken) {
            return res.json({
                result: 'needs setup'
            })
        } else if(!req.user.stripeACHVerified) {
            return res.json({
                result: 'needs verification'
            })
        } else {
            var invoiceList = req.body.invoiceList || [];

            db.Payment.findAll({
                where: {
                    id: invoiceList,
                    paid: false
                }
            }).then(payments => {
                var totalDollars = payments.reduce((sum, pmt) => sum + pmt.amount, 0);
                var totalCents = totalDollars * 100;
                // var customerID = getStripeCustomer(req, req.user.email).id;
                var customerID = req.user.stripeCustToken;
                var tokenID = req.user.stripeACHToken;
    
                if (totalCents === 0) {
                    return res.json({ status: 'zero payment' });
                };

                stripe.charges.create({
                    amount: totalCents,
                    currency: "usd",
                    customer: customerID,
                    receipt_email: req.user.email
                },
                    function (err, charge) { 
                        if (err) { 
                            console.error(err);
                            res.json({ result: 'error' });
                        } else {
                            db.Payment.update({ paid: true }, { where: { id: invoiceList } })
                            .then(data => {
                                res.json({
                                    result: 'paid'
                                });
                            })
                            .catch(error => {
                                res.json({ result: 'error' });
                            })                       
                        }
                    }
                );
                
            });
        }
    });
    
    router.post('/api/setupACH', (req, res, next) => {
        console.log(req.body)
        req.user.update({stripeACHToken: req.body.token.id, stripeACHVerified: false})
            .then(data => {
            // login to get req.user up to date with changes made above
            req.logIn(req.user, err => {
                // here
                getStripeCustomer(req, req.user.email)
                    .then(customer => {
                        var tokenID = req.user.stripeACHToken;

                        stripe.customers.createSource(customer.id, {
                            source: tokenID
                        },
                        function (err, source) {
                            if (err) {
                                console.log(err);
                                return res.status(500).end();
                            }
                        });
                    }).catch(err => {
                        res.status(500).end();
                        console.log(err);
                    })
                
                if(!err) {
                    emailSnd.sendACHVerification(req.user)               
                    res.json({result: "success"})

                }
            })            
        }).catch(err => {
            res.status(500).end();
            console.log(err);
        });
    });

    router.post('/api/verifyACH', (req, res, next) => {
        var amount1 = req.body[0];
        var amount2 = req.body[1];     


        getStripeCustomer(req, req.user.email)
            .then(customer => {
                var sourceID =  customer.sources.data.find(source => source.object === 'bank_account').id
                stripe.customers.verifySource(
                    customer.id,
                    sourceID,
                    { amounts: [amount1, amount2] },
                    function (err, bankAccount) {
                        if (err) {
                            console.log(err);
                            return res.status(500).end();
                        }
                        req.user.update({ stripeACHVerified: true })
                            .then(data => {
                                res.json({ result: "success" })
                            }).catch(err => {
                                res.status(500).end();
                                console.log(err);
                            }
                            );
                    }
                );
            }).catch(err => {
                res.status(500).end();
                console.log(err);
            })
    });
}

{ // Users
    // POST - Creates a user from the admin dashboard
    // router.post('/api/createUser', (req, res, next) => {
    //     var data = req.body;
    //     data.activationCode = uuidv1();
    //     emailSnd.sendInv(data); // Send the user data and the uuid to the tenant through email
    //     data.UnitId = data.unit;
    //     data.role = 'tenant';
    //     db.Unit.findOne({ where: { id: data.UnitId } }).then(function (findUnit) {
    //         // console.log(findUnit);
    //         db.User.create(data).then(function (dbUser) {
    //             findUnit.setUsers([dbUser]);
    //             res.json({
    //                 activationCode: dbUser.activationCode
    //             });
    //         }).catch(function (Error) {
    //             if (Error) throw console.log(Error);
    //         })
    //     }).catch(function (Error) {
    //         if (Error) throw console.log(Error);
    //     })

    // });

    // POST - Activates a user
    /* Expects:  {
           activationCode: string
       }
       Returns: {
            result: 'success' | 'error,
            accountStatus?: 'new' | 'local reset' | 'full reset'
       }
       // 'local reset' refers to when a user resets his password. He has a username which
       //  will remain intact unless he opts to use OAuth.
       // 'full reset' refers to an OAuth user who is resetting credentials. He has no residual
       // credentials to be retained.
    */
    router.post('/api/activateUser', (req, res, next) => {
        if (req.body.activationCode && !req.user) {
            db.User.findOne({ where: { activationCode: req.body.activationCode } })
                .then(user => {
                    if (user) {
                        // If the user already has credentials he is performing a password reset and ui should act accordingly.
                        var accountStatus = 'new';
                        if (user.hasCredentials()) {
                            accountStatus = user.local_username ? 'local reset' : 'full reset';
                        }

                        req.session.activationCode = req.body.activationCode;
                        res.json({
                            result: 'success',
                            accountStatus: accountStatus,
                        });
                    } else {
                        req.session.activationCode = null;
                        res.json({ result: 'error' });
                    }
                }).catch(err => { 
                    console.log(err);
                    res.json({ result: 'error' });
                });
            
        } else {
            res.json({ result: 'error' });
        }
    });

    // // POST - Login local (provided by passport)
    // router.post('/api/loginLocal', (req, res, next) => {

    // });

    // POST - Resets user (allows new password to be entered)
    // Expects: {
    //      username: string
    // }
    // Returns: {
    //      result: string,
    //          // 'reset' - The operation succeeded and an email was sent to the user
    //          // 'not found' - The username wasn't found
    //          // 'reset pending' - The operation failed because there is already a password reset for this account
    //          // 'error' - Unknown error
    //      error?: string
    // }
    router.post('/api/resetUser', (req, res, next) => {
        if (!req.body || !req.body.username) {
            return res.status(400).end();
        }

        db.User
            .findOne({ where: { local_username: req.username } })
            .then(foundUser => {
                if (!foundUser) {
                    return res.json({
                        result: 'not found',
                    })
                }else if (foundUser.activationCode) {
                    return res.json({
                        result: 'reset pending'
                    })
                } else {
                    var activation = uuidv1();
                    return foundUser
                        .update({ activationCode: activation })
                        .then(() => emailSnd.sendPasswordReset(data))
                        .then(() => {
                            res.json({
                                result: 'reset',
                            });
                        });
                }
            });
    });

    // // GET - Returns an array of users
    // router.get('/api/getUserlist', (req, res, next) => {
    //     if (req.user && req.user.role == 'admin') {
    //         db.User
    //             .findAll({})
    //             .then(users => {
    //                 var userlist = users.map(user => ({
    //                     id: user.id,
    //                     fullname: user.fullname,
    //                     role: user.role,
    //                     activated: !user.activationCode,
    //                     activationCode: user.activationCode,
    //                     phone: user.phone,
    //                     email: user.email,
    //                     authtype: user.authtype || getAccountType(user),
    //                     address: user.address,
    //                     city: user.city,
    //                     state: user.state,
    //                     zip: user.zip,
    //                 }));

    //                 res.json(userlist);
    //             });
    //     } else {
    //         return res.status(403).end(); // forbidden
    //     }

    //     function getAccountType(userModel) {
    //         if (userModel.googleId) return 'google';
    //         if (userModel.local_username) return 'local';
    //         return 'other';
    //     }
    // });

    // GET - Gets a user's log-in status: {status: 'logged out' | 'tenant' | 'admin' }
    router.get("/api/userStatus", (req, res, next) => {
        var user = req.user;
        if (!user) {
            res.json({
                status: 'logged out',
                appTitle: appSettings.getSetting('appTitle'),
                bannerText: appSettings.getSetting('bannerText'),
            });
        } else {
            var role = user.role || 'tenant'; // assume the most restrictive account type if not present
            res.json({
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
    });
}

// Units
{
    // GET - Returns list of units, in the form of 
    // { 
    //    units: {
    //        unitName: string,
    //        id: ?,
    //    } []
    // }
    // router.get('/api/getUnitList', (req, res, next) => {
    //     // Admin-only route
    //     if (!req.user || req.user.role != 'admin') return res.status(403).end();

    //     db.Unit
    //         .findAll({
    //             include: [db.User],
    //         })
    //         .then(units => {
    //             res.json({
    //                 units: units.map(unit => ({
    //                     unitName: unit.unitName,
    //                     id: unit.id,
    //                     rate: unit.rate,
    //                     users: unit.Users.map(user => ({
    //                         id: user.id,
    //                         fullname: user.fullname,
    //                     })),
    //                 }))
    //             });
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(500).end();
    //         });
    // });

    // POST - Creates a unit.
    /*  Request body: {
            unitName: string,
            rate: int,
            users: id[]
        }
        Returns: {
            id: id
        }
    */  
    // router.post('/api/createUnit', (req, res, next) => {
    //     // Admin-only route
    //     if (!req.user || req.user.role != 'admin') return res.status(403).end();
        
    //     // Find users first
    //     var ids = req.body.users;
    //     var userPromises = ids.map(id => db.User.findById(id));
    //     var unit, users;

    //     Promise.all(userPromises)
    //         .then(foundUsers => {
    //             users = foundUsers;
    //             return db.Unit.create({
    //                 unitName: req.body.unitName,
    //                 rate: req.body.rate,
    //             });
    //         }).then(createdUnit => {
    //             unit = createdUnit;
    //             return unit.addUsers(users);
    //         }).then(() => { 
    //             res.json({ id: unit.id });
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(500).send();
    //         });
    // });

    // POST - Edits a unit.
    /*  Request body: {
            id: id,
            unitName?: string,
            rate?: int,
            users?: id[]
        }
        Returns: {
            id: id
        }
    */ 
    // router.post('/api/editUnit', (req, res, next) => {
    //     // Admin-only route
    //     if (!req.user || req.user.role != 'admin') return res.status(403).end();
    //     if (!req.body.id) return res.status(500).send('invalid id').end();

    //     var values = {};
    //     if (req.body.unitName) values.unitName = req.body.unitName;
    //     if (req.body.rate) values.rate = req.body.rate;
    //     if (req.body.users) values.UserIds = req.body.users;

    //     var unit;
    //     db.Unit
    //         .findById(req.body.id)
    //         .then(foundUnit => {
    //             if (foundUnit == null) throw Error('unit not found');
    //             unit = foundUnit;
    //             return unit.update(values);
    //         }).then(unit => {
    //             if (req.body.users) {
    //                 return unit.setUsers(req.body.users);
    //             }
    //         }).then(() => {
    //             res.json({ id: req.body.id });
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(500).send(err.toString()).end();

    //         });
    // });

    // router.get('/api/getOwnUnits', (req, res, next) => {
    //     if (!req.user) return res.status(403).end();

    //     req.user.getUnits()
    //         .then(units => {
    //             res.json({ units: units });
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(500).end();
    //         });
    // });
}

// Settings 
{
    router.get('/api/getSettings', (req, res, next) => {
        if (!req.user || req.user.role != 'admin') return res.status(403).end();
        
        res.json({ settings: appSettings.getAllSettings() });
    })

    // Expects {
    //   settings: { 
    //       name: string,
    //       value: string,
    //       description?: string,
    //   } []
    // }
    // Returns {
    //   result: 'success', 'error'
    // } 
    // NOTE: error may indicate that SOME settings have changed while others have not(only applies if multiple settings were sent)
    router.post('/api/changeSettings', (req, res, next) => {
        if (!req.user || req.user.role != 'admin') return res.status(403).end();
        if (!req.body || !req.body.settings || !req.body.settings.map) return res.status(400).end();

        var pendingChanges = req.body.settings.map(setting => appSettings.changeSetting(setting.name, setting.value, setting.description));

        Promise.all(pendingChanges)
            .then(results => {
                res.json({ result: 'success' });
            }).catch(err => { 
                console.log(err);
                res.json({ result: 'error' });
            });
    })
}

module.exports = router;
