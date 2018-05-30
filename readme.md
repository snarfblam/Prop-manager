# Tenant Service Portal

Easy-to-use software for rental property owners. Generates invoices, accepts payments from tenants, and manages a maintenance request list.

## **Contents**

- [Usage Guide](#tenant-service-portal)
  * [Administrator](#administrator)
  * [Create Units](#create-units)
  * [Create Users](#create-users)
  * [Invoicing](#invoicing)
- [Deployment](#deployment)
  * [All Deployments](#all-deployments)
  * [Non-Heroku Deployment](#non-heroku-deployment)
  * [Environment Variables](#environment-variables)
- [Under The Hood](#under-the-hood)
  * [Packages](#packages)
    + [Server Packages](#server-packages)
    + [Client Packages](#client-packages)
  * [Other Code Resources](#other-code-resources)
  * [Directory Structure](#directory-structure)
## Administrator
When the application first launches, the administrator account is created automatically, but **must be activated**. Visit the page `/tenant/activate/admin` and authenticate with Google or create a username and password. This account has exclusive access to the administration dashboard.

## Create Units
There must be at least one unit to begin creating users, so the simplest approach is to create all of your units first. Visit the *Units* page and click *Add New Unit*. Give the unit a name and specify the monthly rent. You can temporarily assign the administrator as the tenant.

## Create Users
Once your units are set up, create accounts for your tenants. Visit the *Users* page, and click the *New User* button. Select the unit the user is associated with and fill in their name and contact information. Note that the email address entered is **not** used for authentication, only correspondence. Once the form is filled, click *Create User*. The user will be emailed an activation link to gain access the the account.

## Invoicing
Invoices are generated monthly as configured for each unit. Users are emailed a notification when the invoice is generated and can visit the site to pay via credit card (or ACH if the user has set up it up). The application does not store any information regarding invoices and payments except the due date, the amount, and whether it has been paid. Transactions and all financial information are handled directly by Stripe.

The invoice generated each month is based on the rent rate listed at the beginning of the month. If the rent rate is zero for the entirety of a month, an invoice will not be generated. If the rent rate is zero, but then changed to another amount in the middle of a month, an invoice will be generated at that time (or soon thereafter).

When a payment is made through other means, e.g. cash or check, you can find the invoice in the *Payments* page and manually mark it as payed.

# Deployment

This application relies on a number of third-party services. You will need to configure and obtain credentials for:

* **Google** (OAuth) - Visit the [Google developer console](https://console.cloud.google.com) and, under *APIs & Services*, select "Credentials" from the navigation on the left. Set up OAuth 2.0 client IDs for your deployment.
* **Stripe** - Set up an application on [Stripe](https://stripe.com/). You'll want to enable ACH transfers and to obtain secret and publishable keys.
* **Mailgun** - Set up a domain and obtain public and private keys for [Mailgun](https://www.mailgun.com/).
* **MySQL** - A MySQL database is required. On Heroku, a [JawsDB provision](https://elements.heroku.com/addons/jawsdb) is most convenient and will not require any configuration.

## All Deployments
Follow these steps for any deployment.

1. Copy or clone the repository into a Node environment. For Heroku, the recommended approach is to clone the repository and use Heroku CLI to create an app, then `git push` to the generated `heroku` remote.
2. In the application's root directory run the command `npm install`
3. If necessary, create a database in your local MySQL server named `propsmanager` for the development environment.
4. Configure environment variables (see below)


## Non-Heroku Deployment
Heroku is the simplest deployment option. However, it is not required. If you're not deploying to Heroku, the following additional steps need to be performed manually:

5. In the application's `/client` subdirectory run the command `yarn` to install React dependencies.
6. Build the client by running `yarn run build` in the `/client` directory.
7. Start the appliction: run `npm start` in the application's root directory.


## Environment Variables

* `NODE_ENV` - Should be set by the server startup command or inherited by the environment to either `production` or `development`.
* `DB_UNAME` - *(development)* Name of local database
* `DB_PASSWD` - *(development)* Password for local database
* `JAWSDB_URL` - *(production)* Connection string for database. This does *not* need to be a JawsDB provision.
* `GOOGLE_CLIENT_ID` - Google OAuth 2.0 application ID
* `GOOGLE_CLIENT_SECRET` - Google OAuth 2.0 secret key
* `PUBLISHABLE_KEY` - Stripe publishable key.
* `SECRET_KEY` - Stripe secret key
* `PUBLIC_KEY` - Mailgun public key
* `PRIVATE_KEY` - Mailgun secret key
* `DOMAIN_` - Mailgun domain

# Under The Hood

## Packages
### Server Packages
* `express` - Web Server
* `express-session` + `express-session-sequelize` - Add user session functionality to Express server
* `sequelize` + `mysql2` - Programmatic MySQL interface
* `stripe` - Stripe API for processing financial transactions
* `passport` + `passport-google-oauth` - Account login using Google
* `bcrypt` - Encryption library, used to hash passwords
* `mailgun-js` - To send account activation and other emails to users
express-session-sequelize
* `node-cron` - Scheduler used for generating monthly invoices
* `uuid` - Used to generate activation codes for user accounts
* `dotenv` - Environment variable parser
* `moment` - General purpose date/time functionality

### Client Packages
* `react` - Front-end application framework
* `react-router-dom` - Single-page-application router
* `axios` - HTTP client used for AJAX
* **Stripe JS** - Front-end Stripe payment component
* **Bootstrap 4** - Responsive CSS framework

## Other Code Resources
* `sequelize-cli` - Used to initialize Sequelize project
* `create-react-app` - Used to initiialize React project
* `mern-passport` - [mern-passport](https://github.com/thechutrain/mern-passport) was used as a template to implement OAuth in a React-based site. It was converted from Mongoose to Sequelize and modified to enable the account activation flow.

## Directory Structure

```
Tenant Service Portal
├─● client/             React Project
│ ├─● public/           Static front-end files
│ └─● src/              React code
│   ├─● components/     Re-usable page elements
│   │ └─● Bootstrap/    Bootstrap 4 components
│   └─● pages/          Page components that correspond to routes
│     └─● modals/       Components to be housed in a modal
├─● config/             Database connection parameters
├─● cron/               Scheduled jobs
├─● mail/               Email sending
├─● models/             Sequelize models
├─● passport/           Passport logic (see also, /routes/auth)
└─● routes/             HTTP routes
  └─● auth/             Passport auth routes
```                     