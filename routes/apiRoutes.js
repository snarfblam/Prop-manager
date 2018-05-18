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
        .then(function(dbUnits) {
            data.UnitId = dbUnits[0].id;
            db.Maintenance.create(data).then(function(dbMaint) {
                res.json(dbMaint)
            }) 
        })
    });

    // POST - Mark a maintenance request as completed
    router.post('/api/completeMaintRequest', (req, res, next) => {

    });

    // GET - User gets all of their maintenance requests
    router.get('/api/getOwnMaintRequest', (req, res, next) => {

    });

    // GET -  Admin gets all of the maintenance requests that are open
    router.get('/api/getAllMaintRequests', (req, res, next) => {

    });
}

{ // Payments
    // POST - submits payment to stripe from tenant page
    //Creates the Strip modal for Credit card transaction that takes the card and email for from the person making the payment
    router.post('/api/submitPayment', (req, res, next) => {
        let amount = 500;

        stripe.customers.create({
            email: req.body.email,
            card: req.body.id
        }).then(customer =>
            stripe.charges.create({
                amount,
                description: "Rent Payment",
                currency: "usd",
                customer: customer.id
            })).then(charge => {
                console.log("successful payment");
                db.Payment.findOne( { where: {Unitid: 1} }).then(function(dbpayment) {
                    if(dbpayment) {
                        dbpayment.updateAttributes({
                            paid: true
                        })
                    }                    
                }) 
                res.send(charge)
            }).catch(err => {
                console.log("Error:", err);
                res.status(500).send({ error: "Purchase Failed" });
            });
    });

    // GET - gets rent amount that the tenant owes
    router.get('/api/rentAmount', (req, res, next) => {

    });

    // GET - gets the tenant’s payment history
    router.get('/api/paymentHistory', (req, res, next) => {

    });

    // GET - gets all of the payment history for the admin
    router.get('/api/allPayments', (req, res, next) => {

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

// Surprise routes: Routes nobody planned on! (oops...)
{
    // GET - Returns list of units, in the form of 
    // { 
    //    units: {
    //        unitName: string,
    //        id: ?,
    //    } []
    // }
    router.get('/api/getUnitList', (req, res, next) => {
        db.Unit
            .findAll({})
            .then(units => {
                res.json({
                    units: units.map(unit => ({
                        unitName: unit.unitName,
                        id: unit.id,
                    }))
                });
            }).catch(err => {
                console.log(err);
                res.status(500).end();
            });
    });
}

module.exports = router;
