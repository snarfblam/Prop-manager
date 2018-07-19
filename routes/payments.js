/*
    Implements payment operations for the TSP API.
*/


/// Modules //////////////////////////////////////////////////////////
const db = require('../models');
const requirements = require('./requirements');
const uuidv1 = require('uuid/v1');
const mailer = require('../mail/emailActivation');
const appSettings = require('../appSettings');

const keys = require("../keys.js");
const stripeKeys = keys.Stripe;
const keyPublishable = stripeKeys.PUBLISHABLE_KEY;
const keySecret = stripeKeys.SECRET_KEY;
const stripe = require("stripe")(keySecret);

module.exports = {
    SubmitCardPayment: {
        requirements: [requirements.tenant],
        execute: (user, params) => {
            var invoiceList = params.invoiceList || [];

            return db.Payment.findAll({
                where: {
                    id: invoiceList,
                    paid: false
                }
            }).then(payments => {
                var totalDollars = payments.reduce((sum, pmt) => sum + pmt.amount, 0);
                var totalCents = totalDollars * 100;
    
                if (totalCents === 0) return { status: 'zero payment' };
                
                return getStripeCustomer(user, params.email, params.id)
                    .then(customer =>
                        stripe.charges.create({
                            amount: totalCents,
                            description: "Rent Payment",
                            currency: "usd",
                            customer: customer.id,
                            receipt_email: params.email,
                        })
                    ).then(charge =>
                        // Mark all specified invoices as paid
                        db.Payment.update({ paid: true }, { where: { id: invoiceList } })
                            .then(() => ({
                                // Respond with finialized payment details
                                amount: charge.amount,
                                status: charge.status,
                                paid: charge.paid,
                                currency: charge.currency,
                                description: charge.description,
                            }))
                    );
            });
        }
    },

    MarkInvoicePaid: {
        requirements: [requirements.admin],
        execute: (user, params) =>
            db.Payment.findById(params.id)
                .then(payment => {
                    if (payment) {
                        return payment.updateAttributes({ paid: true, });
                    } else {
                        throw "Invalid invoice number"
                    }
                })
        
    },

    SetupACH: {
        requirements: [requirements.tenant],
        execute: (user, params, req) => {
            return user.update({ stripeACHToken: params.token.id, stripeACHVerified: false })
                .then(() => UserRelog(req)) // refresh req.user
                .then(user_new => getStripeCustomer(user_new, user.email))
                .then(customer => CreateStripeSource(customer, params.token.id))
                .then(source => {
                    mailer.sendACHVerification(user).catch(console.error);
                    return { result: 'success' };
                });
        }
    },

    PayACH: {
        requirements: [requirements.tenant],
        execute: (user, params, req) => {
            if (!user.stripeACHToken) {
                return 'needs setup';
            } else if (!user.stripeACHVerified) {
                return 'needs verification';
            }

            var where = {
                id: params.invoiceList || [],
                paid: false
            };

            return db.Payment.findAll({where: where})
                .then(payments => {
                    var totalDollars = payments.reduce((sum, pmt) => sum + pmt.amount, 0);
                    var totalCents = totalDollars * 100;
                    if (totalCents == 0) return null;
                
                    return CreateStripeCharge(user, totalCents);
                })
                .then(charge => {
                    if (!charge) return 'zero payment';

                    return db.Payment.update({ paid: true }, { where: { id: params.invoiceList } })
                        .then(() => 'paid')
                        .catch(err => { console.log(err); return 'error' });
                })
        }
    },

    VerifyACH: {
        requirements: [requirements.tenant],
        execute: (user, params, req) => {
            var amount1 = params[0];
            var amount2 = params[1];
    
            return getStripeCustomer(user, user.email)
                .then(customer => {
                    var source = customer.sources.data.find(source => source.object === 'bank_account');
                    return VerifyStripeSource(customer, source, [amount1, amount2]);
                })
                .then(x => user.update({ stripeACHVerified: true }))
                .then(x => 'success');
        }
    },
};

// Verifies a stripe ACH source. Returns a promise.
function VerifyStripeSource(customer, source, amounts) {
    return new Promise((resolve, reject) =>
        stripe.customers.verifySource(
            customer.id,
            source.id,
            { amounts: amounts },
            (err, bankAccount) =>
                err ? reject(err) : resolve(bankAccount)
    ));
}

// Creates a source on a stripe customer. Returns a promise.
function CreateStripeSource(customer, sourceTokenId) {
    return new Promise((resolve, reject) => {
        stripe.customers.createSource(
            customer.id,
            { source: sourceTokenId },
            (err, source) => err ? reject(err) : resolve(source)
        );
    });
}

// Creates a stripe charge. Returns a promise. Currency defaults to 'usd'. Amount should be specified in hundreths of currency, e.g. 123.0 = $1.23 USD.
function CreateStripeCharge(user, cents, currency) {
    var currencyValue = currency || 'usd';

    return new Promise((resolve, reject) => {
        stripe.charges.create(
            {
                amount: cents,
                currency: currencyValue,
                customer: user.stripeCustToken,
                receipt_email: user.email
            },
            (err, charge) => err ? reject(err) : resolve(charge)
        );
    });
}

// Re-logs a user in, refreshing the request.user object. Returns a promise.
function UserRelog(request) {
    return new Promise((resolve, reject) => {
        request.logIn(request.user, err => 
            err ? reject(err) : resolve(request.user)
        );
    });
}

function getStripeCustomer(user, email, card) {
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
}