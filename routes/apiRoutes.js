const express = require('express');
const db = require('../models');
const uuidv1 = require('uuid/v1');
require("dotenv").config();
const keys = require("../keys.js");
const stripeKeys = keys.Stripe;
const keyPublishable = stripeKeys.PUBLISHABLE_KEY;
const keySecret = stripeKeys.SECRET_KEY;
const stripe = require("stripe")(keySecret);


var router = express.Router();

{ // Maintenance Requests
    // POST - Post a maintenance request to the database
    router.post('/api/postMaintRequest', (req, res, next) => {
        var data = req.body;
        req.user.getUnits()
            .then(function (dbUnits) {
                data.UnitId = dbUnits[0].id;
                db.Maintenance.create(data).then(function (dbMaint) {
                    res.json(dbMaint)
                })
            }).catch(console.log);
    });

    // POST - Mark a maintenance request as completed
    router.post('/api/completeMaintRequest', (req, res, next) => {
        
        db.Maintenance.findById(req.body.id).then(function(dbMaint){
            if(dbMaint) {
                dbMaint.updateAttributes({
                    status: false // false means closed
                })
            }
            res.sendStatus(200)
        }).catch(function(error) {
            if(error) throw error;
        })
    });

    // GET - User gets all of their maintenance requests
    router.get('/api/getOwnMaintRequest', (req, res, next) => {
        req.user.getUnits().then(function(dbUnits) {            
            db.Maintenance.findAll({
                where: {
                    UnitId: dbUnits[0].id
                }
            }).then(function(dbMaint) {
                res.json(dbMaint)
            }) 
        })
    });

    // POST -  Admin gets all of the maintenance requests that are open
    /* Request body: {
        where?: {status?: boolean} // status = true for open maint requests
    }
    */
    router.post('/api/getAllMaintRequests', (req, res, next) => {
        // Only allowed for logged-in admins
        if (!req.user || req.user.role != 'admin') {
            return res.status(403).end();
        }
        
        var where = (req.body || {}).where || {};

        db.Maintenance.findAll({
            where: where,
            include: [db.Unit],
        }).then(function(dbMaint) {
            res.json(dbMaint)
        }).catch(err => {
            res.status(500).end();
            console.log(err);
        });
    });
}

{ // Payments
    // POST - submits payment to stripe from tenant page
    //Creates the Strip modal for Credit card transaction that takes the card and email for from the person making the payment
    router.post('/api/submitPayment', (req, res, next) => {
        // let amount = 500;

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

    /* GET - gets rent amount that the tenant owes
        Returns array: {
            unitId: number,
            paymentId: number
            unitName: string,
            amount: number <dollars>,
            due: Date,
        } []
    
    */
    router.get('/api/rentAmount', (req, res, next) => {
        if (req.user) {
            req.user
                .getUnits({ include: [{ model: db.Payment, where: { paid: false } }] })
                .then(units => {
                    var results = [];

                    units.forEach(unit => {
                        unit.Payments.forEach(payment => {
                            results.push({
                                id: payment.id,
                                unitId: unit.id,
                                paymentId: payment.id,
                                unitName: unit.unitName,
                                amount: payment.amount,
                                due: payment.due_date,
                            });
                        });
                    });
                    res.json(results);
                });
        } else {
            res.json([]); // whole lotta nuffin
        }
    });

    // GET - gets the tenant’s payment history
    router.get('/api/paymentHistory', (req, res, next) => {

    });

    // POST - gets all of the payment history for the admin
    /* Request body: {
           where?: {paid?: boolean} 
       }
    */
    router.post('/api/allPayments', (req, res, next) => {
        // Only allowed for logged-in admins
        if (!req.user || req.user.role != 'admin') {
            return res.status(403).end();
        }

        var where = (req.body || {}).where || {};

        db.Payment.findAll({
            where: where,
            include: [db.Unit],
        }).then(payments => {
            res.json(payments);
        }).catch(err => {
            res.status(500).end();
            console.log(err);
        });
    });

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
                var customerID = getStripeCustomer(req, req.user.email).id;
                var tokenID = req.user.stripeACHToken;
    
                if (totalCents === 0) {
                    return res.json({ status: 'zero payment' });
                };
    
                stripe.charges.create({
                    amount: totalCents,
                    currency: "usd",
                    source: tokenID, 
                    customer: customerID,
                    description: "Charge for 132 Chapel St. LLC"
                }, 
                    function(err, charge) {
                        if(err) throw err;

                        if(charge.paid == true) {
                            res.json({
                                result: 'paid'
                            });
                        }
                    }
                )
            });
        }
    });
    

    router.post('api/setupACH', (req, res, next) => {
        req.user.update({stripeACHToken: req.body, stripeACHVerified: false})
        .then(
            res.json({result: "success"})
        ).catch(err => {
            res.status(500).end();
            console.log(err);
        });
    });

    router.post('api/verifyACH'), (req, res, next) => {
        var tokenID = req.user.stripeACHToken;
        var customerID = getStripeCustomer(req, req.user.email).id;
        var amount1 = req.body.amounts[0];
        var amount2 = req.body.amounts[1];

        stripe.customers.verifySource(
            customerID,
            tokenID,
            {
            amounts: [amount1, amount2]
            },
            function(err, bankAccount) {
                if(err) throw err;
                req.user.update({stripeACHVerified: true})
            .then(
                res.json({result: "success"})
            ).catch(err => {
                res.status(500).end();
                console.log(err);
            });
        });
    }
}

{ // Users
    // POST - Creates a user from the admin dashboard
    router.post('/api/createUser', (req, res, next) => {
        var data = req.body;
        data.activationCode = uuidv1();
        data.UnitId = data.unit;
        data.role = 'tenant';
        db.Unit.findOne({ where: { id: data.UnitId } }).then(function (findUnit) {
            console.log(findUnit);
            db.User.create(data).then(function (dbUser) {
                findUnit.addUser(dbUser);
                res.json({
                    activationCode: dbUser.activationCode
                });
            }).catch(function (Error) {
                if (Error) throw console.log(Error);
            })
        }).catch(function (Error) {
            if (Error) throw console.log(Error);
        })

    });

    // POST - Activates a user
    router.post('/api/activateUser', (req, res, next) => {
        if (req.body.activationCode && !req.user) {
            db.User.findOne({ where: { activationCode: req.body.activationCode } })
                .then(user => {
                    if (user) {
                        req.session.activationCode = req.body.activationCode;
                        res.json({ result: 'success' });
                    } else {
                        req.session.activationCode = null;
                        res.json({ result: 'error' });
                    }
                });
            
        } else {
            res.json({ result: 'error' });
        }
    });

    // POST - Login local (provided by passport)
    router.post('/api/loginLocal', (req, res, next) => {

    });

    // GET - Returns an array of users
    router.get('/api/getUserlist', (req, res, next) => {
        if (req.user && req.user.role == 'admin') {
            db.User
                .findAll({})
                .then(users => {
                    var userlist = users.map(user => ({
                        id: user.id,
                        fullname: user.fullname,
                        role: user.role,
                        activated: !user.activationCode,
                        phone: user.phone,
                        email: user.email,
                        authtype: user.authtype || getAccountType(user),
                        address: user.address,
                        city: user.city,
                        state: user.state,
                        zip: user.zip,
                    }));

                    res.json(userlist);
                });
        } else {
            return res.status(403).end(); // forbidden
        }

        function getAccountType(userModel) {
            if (userModel.googleId) return 'google';
            if (userModel.local_username) return 'local';
            return 'other';
        }
    });

    // GET - Gets a user's log-in status: {status: 'logged out' | 'tenant' | 'admin' }
    router.get("/api/userStatus", (req, res, next) => {
        var user = req.user;
        if (!user) {
            res.json({ status: 'logged out' });
        } else {
            var role = user.role || 'tenant'; // assume the most restrictive account type if not present
            res.json({ status: role });
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
    router.get('/api/getUnitList', (req, res, next) => {
        // Admin-only route
        if (!req.user || req.user.role != 'admin') return res.status(403).end();

        db.Unit
            .findAll({
                include: [db.User],
            })
            .then(units => {
                res.json({
                    units: units.map(unit => ({
                        unitName: unit.unitName,
                        id: unit.id,
                        rate: unit.rate,
                        users: unit.Users.map(user => ({
                            id: user.id,
                            fullname: user.fullname,
                        })),
                    }))
                });
            }).catch(err => {
                console.log(err);
                res.status(500).end();
            });
    });

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
    router.post('/api/createUnit', (req, res, next) => {
        // Admin-only route
        if (!req.user || req.user.role != 'admin') return res.status(403).end();
        
        // Find users first
        var ids = req.body.users;
        var userPromises = ids.map(id => db.User.findById(id));
        var unit, users;

        Promise.all(userPromises)
            .then(foundUsers => {
                users = foundUsers;
                return db.Unit.create({
                    unitName: req.body.unitName,
                    rate: req.body.rate,
                });
            }).then(createdUnit => {
                unit = createdUnit;
                return unit.addUsers(users);
            }).then(() => { 
                res.json({ id: unit.id });
            }).catch(err => {
                console.log(err);
                res.status(500).send();
            });
    });

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
    router.post('/api/editUnit', (req, res, next) => {
        // Admin-only route
        if (!req.user || req.user.role != 'admin') return res.status(403).end();
        if (!req.body.id) return res.status(500).send('invalid id').end();

        var values = {};
        if (req.body.unitName) values.unitName = req.body.unitName;
        if (req.body.rate) values.rate = req.body.rate;
        if (req.body.users) values.UserIds = req.body.users;

        var unit;
        db.Unit
            .findById(req.body.id)
            .then(foundUnit => {
                if (foundUnit == null) throw Error('unit not found');
                unit = foundUnit;
                return unit.update(values);
            }).then(unit => {
                if (req.body.users) {
                    return unit.setUsers(req.body.users);
                }
            }).then(() => {
                res.json({ id: req.body.id });
            }).catch(err => {
                console.log(err);
                res.status(500).send(err.toString()).end();

            });
    });
}

module.exports = router;
