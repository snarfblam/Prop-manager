# Prop-Manager

Easy-to-use software for rental property owners. Generates invoices, accepts payments from tenants, and manages a maintenance request list.

### Todo
* Environment variables details
* Heorku details
* Table of contents
* How to create units

# Using the Application

### Administrator
First thing to do is to activate the administrator account. Visit the site at *`<app location>`*`/tenant/activate/admin` and authenticate with Google or create a username and password.

### Create Units
***`create unit stuff here`***

### Create Users
Once your units are set up, create accounts for your tenants. Visit the *Users* page (*`<app location>`*`/admin/users`), and click the *New User* button. Select the unit the user is associated with and fill in their name and contact information. Note that the email address entered is **not** used for authentication. Once the form is filled, click *Create User*. The user will be emailed an activation link that allows them to activate their tenant account in the same manner that the administrator account was activated.

### Invoicing
Invoices are generated monthly as configured for each unit. Users are emailed a notification when the invoice is generated. They can log in an pay with stripe.

# Deployment

Deployment is pretty straightforward. To host the application, the following are needed: a Node environment, Google application credentials (for user authentication), [Stripe](https://stripe.com/) credentials, and a MySQL database.

1. Copy or clone the repository into your server environment with Node and Yarn installed
2. In the application's root directory run the command `npm install`
3. In the application's `/client` subdirectory run the command `yarn`
4. For MySQL, create a database named `propsmanager`. The application will need the appropriate permissions to create a schema.
5. Configure environment variables (see below)
6. Build the client (this happens automatically on Heroku) by running `yarn run build` in the `/client` directory
7. Start the appliction: run `npm start` in the application's root directory.


## Environment Variables

***`put stuff here`***

## Heroku

***`put stuff here too. like links to setting up jawsdb provision and how to make heroku build the client.`***