//NPM INSTALL EXPORTS AND DOTENV!!!!!!!
require("exports");
const appSettings = require('./appSettings');

exports.Stripe = {
  PUBLISHABLE_KEY: appSettings.getSetting('PUBLISHABLE_KEY'),
  SECRET_KEY: appSettings.getSetting('SECRET_KEY')
};
