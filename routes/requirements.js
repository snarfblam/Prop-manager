/*
    Provides 'requirements' options for API operations. 
*/

module.exports = {
    admin: {
        test: function (req) {
            return req.user && req.user.role == 'admin';
        },
        errorMessage: 'Operation requires administrator permissions',
    },
    tenant: {
        test: function (req) {
            return req.user && req.user.role == 'tenant';
        },
        errorMessage: 'Operation requires tenant permissions',
    },
    logged: {
        test: function (req) {
            return !!req.user;
        },
        errorMessage: "Operation requires user to be logged in."
    },
    unlogged: {
        test: function (req) {
            return !req.user;
        },
        errorMessage: "Operation requires user to be logged out."
    }
}