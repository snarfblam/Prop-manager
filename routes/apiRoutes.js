var express = require('express');
var db = require('../models');
var status = require('../util/httpStatus').all;


require("dotenv").config();
var keys = require("./keys.js");
var stripeKeys = keys.Stripe;
const keyPublishable = stripeKeys.PUBLISHABLE_KEY;
const keySecret = stripeKeys.SECRET_KEY;
const stripe = require("stripe")(keySecret);

var router = express.Router();

// add some routes pls







//Creates the Strip modal for Credit card transaction that takes the card and email for from the person making the payment
app.post("/charge/card", (req, res) => {
  //TODO: Currently "amount" is statically set to $5. Amount needs to be linked to the database to get the users rent payment amount.

  let amount = 500;

  stripe.customers.create({
    email: req.body.email,
    card: req.body.id
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .then(charge => {
    console.log("successful payment");
    res.send(charge)
  })
  .catch(err => {
    console.log("Error:", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

module.exports = router;
