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
            })
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

            stripe.customers.create({
                email: req.body.email,
                card: req.body.id
            }).then(customer =>
                stripe.charges.create({
                    amount: totalCents,
                    description: "Rent Payment",
                    currency: "usd",
                    customer: customer.id
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
        if (req.body.activationCode) {
            req.session.activationCode = req.body.activationCode;
            res.json({ result: 'success' });
        } else {
            res.status(500).end();
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

}

module.exports = router;
