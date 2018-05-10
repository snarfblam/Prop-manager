//NPM INSTALL EXPORTS AND DOTENV!!!!!!!
require("exports");

exports.Stripe = {
  PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
  SECRET_KEY: process.env.SECRET_KEY
};
