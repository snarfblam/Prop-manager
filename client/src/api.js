/*
    Provides a programmatic interface to the TSP API.

    Note: most operations should be nothing more than a simple call to
    makeTspRequest. However, certain functions manipulate the returned
    promise. This is generally legacy code that should be refactored.

    The idea behind the big refactor of the API is to simplify and 
    streamline interaction with the server to a simple send-an-object
    get-an-object approach. 
*/

import axios from 'axios';

/**
 * Makes a request to the TSP API. Returns a promise (see remarks).
 * @param {string} operation The name of the operation to be performed
 * @param {*} params Any parameters to be sent for the operation. Can be omitted.
 * @returns {Promise<any>}
 */
// Remarks: The returned promise rejects if the response is any kind of error.
//      However, the returned promise has a property, 'any200', which is a promise
//      that resolves as long as the received response is not a HTTP error (i.e.,
//      the status code is 200).
//  
//      Example: makeTspRequest('getErrorValue').any200.then(...);
function makeTspRequest(operation, params) {
    var requestBody = { operation: operation };
    if (params) requestBody.parameters = params;
    var statusCode = null;

    var result = axios.post('/api/tsp', requestBody)
        .then(response => {
            statusCode = response.status;

            if (response.status == 200 && response.data) {
                if (response.data.status == 'error') {
                    // Throw on error value
                    throw Error(response.data.error || 'The server returned an error');
                } else {
                    return response.data.result || null;
                }
            } else {
                // Throw on HTTP error
                var errMsg = 'There was an error making the request.';
                if (response.data && response.data.error) {
                    errMsg = response.data.error;
                }
                errMsg += ' (' + response.status.toString() + ')';
                
                throw Error(errMsg);
            }
        })
        .catch(err => {
            // Attach HTTP status to error object for reference
            err.statusCode = statusCode;
            throw err;
        });
    
    // Provides a property that allows the caller to treat any 200
    // response as a resolved promise.
    result.any200 = result.catch(err => {
        // Resolve to the error value instead of rejecting
        if (err.statusCode === 200) {
            return err;
        } else {
            // HTTP errors are still errors
            throw err;
        }
    });

    return result;
}

/**
 * Sends a request to the server to create a new user. All required user fields must be
 * specified as properties on the userData parameter. Returns a promise that resolves to one of:
 *  success -> {activationCode: string}
 *  failure -> {error: string}
 * @param {any} userData - A list of user properties required for a user account
 * @returns {Promise<any>}
 */
function createNewUser(userData) {
    return makeTspRequest('CreateUser', userData)
        .then(result => {
            if (!result.activationCode) throw Error('Unexpected response from server');

            return result;
        })
        .catch(err => ({ error: (err || {}).toString() }));
}

/**
 * Local auth data for the user name and password
 * {localAuthData: {local_username: string, local_password: string}} or rejects to Error
 * @param {any} localAuthData
 * @returns {Promise<any>}
 */
function setLocalCreds(localAuthData) {
    return axios
        .post('/auth/signup', localAuthData)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.log(err);
            return { error: (err || {}).toString() };
        })
}
 
function resetPassword(username) {
    return axios
        .post('/api/resetUser', { username: username })
        .then(response => response.data)
        .catch(err => {
            console.log(err);
            throw err;
        })
}

function localLogin(username, password) {
    var localAuthData = {
        username: username,
        password: password
    }
    return axios
        .post('/auth/login', localAuthData).then(response => {
            return response.data;
        })
        .catch(err => {
            return { error: (err || {}).toString() };
        });
}

/**
 * Sends a request to the server to create a new unit. Expects {
 *     unitName: string,
 *     rate: int,
 *     users: id[],
 * }
 *  Returns a promise that resolves to one of:
 *  success -> {id: number}
 *  failure -> {error: string}
 * @param {any} userData - A list of user properties required for a user account
 * @returns {Promise<any>}
 */
function createNewUnit(unitData) {
    return makeTspRequest('CreateUnit', unitData)
        .then(result => {
            if (!result || !result.id) throw Error('Unexpected response from server');
            return result;
        });
}

/**
 * Sends a request to the server to create a new unit. Expects {
 *     unitName: string,
 *     rate: int,
 *     users: id[],
 * }
 *  Returns a promise that resolves to one of:
 *  success -> {id: number}
 *  failure -> {error: string}
 */
function editUnit(id, unitData) {
    var data = { ...unitData, id: id };
    if (data.user) data.users = [data.user];

    return makeTspRequest('EditUnit', data)
        .then(response => {
            if (!response.id) throw Error('Unexpected response from server');
            return response;
        })
        .catch(err => ({ error: (err || {}).toString() }));
}

/**
 * Assigns an activation code to a user. This must be done prior to the user's first login to allow the user to activate.
 * Resolves to {status: 'success'} or {error: string}
 * @param {{activationCode: string}} activationData - Object containing data necessary to activate an account
 * @returns {Promise<any>}
 */
function activateUser(activationData) {
    return makeTspRequest('SubmitActivationCode', activationData)
}

/**
 * Retrieves a list of units. Returns a promise that resolves to
 * {units: {unitName: string, id: ?}[]} or rejects to Error
 * @returns {Promise<any>}
 */
function getUnitList() {
    return makeTspRequest('GetUnitList');
    
}

/**
 * Polls the server for the user's login status. Resolves to 
 * {status: 'logged out' | 'tenant' | 'admin'}
 */
function getUserStatus() {
    return makeTspRequest('GetUserStatus');
}

/** Requests a list of due rent payments from the server.
        Resolves to array: {
            unitId: number,
            paymentId: number
            unitName: string,
            amount: number <dollars>,
            due: Date,
        } []
 */
function getRentDue() {
    return makeTspRequest('GetOwnDuePayments');
}

function getAllOwnUnitPayments() {
    return makeTspRequest('GetOwnPayments');
}

function getUserList() {
    return makeTspRequest('GetUserList');
}

function postMaintRequest(message) {
    return makeTspRequest('PostMaintenanceRequest', { message: message });
}

function getOwnMaintRequest() {
    return makeTspRequest("GetOwnMaintenanceRequests");
}

/**
 * Gets all maintenance requests from the server
 * @param {{open?: boolean} } options
 */
function getAllMaintRequests(options) {
    var params = {};
    if (options && options.open != null) {
        params.where = { status: options.open };
    }

    return makeTspRequest('GetAllMaintenanceRequests', params);
}


function changeStatusMaintRequest(id, booleanvalue) {
    return makeTspRequest('ChangeMaintenanceStatus', { id: id, status: booleanvalue });
}


/**
 * Gets all paments from the server
 * @param {{paid?: boolean} } options
 */
function getAllPayments(options) {
    var params = {};
    if (options.paid != null) params.where = { paid: options.paid };

    return makeTspRequest('GetAllPayments', params);

}

function markPaymentPaid(id) {
    return makeTspRequest('MarkInvoicePaid', { id: id });
}

/**
 * Sends a request to pay invoice(s) via ACH. Returns {
 *      result: 'paid' | 'needs setup' | 'needs verification' | 'error'
 *      error?: string
 * }.
 * @param {number[]} invoiceNumbers - ID for Payment records to be paid
 }
 */
function submitPaymentCardToken(token) {
    return makeTspRequest('SubmitCardPayment', token);
}

function payACH(invoiceNumbers) {
    return makeTspRequest('PayACH', { invoiceList: invoiceNumbers }).any200;
}

/**
 * Requests an account be associated with the user for ACH transfers. Returns {
 *      result: 'success' | 'error',
 *      error?: string
 * }
 * @param {{name: string, accountType: string, accountNumber: string, accountRouting: string}} accountDetails - Account information
 */
function setupACH(token) {
    return makeTspRequest('SetupACH', token);
}

/**
 * Requests an account be verified for ACH.
 * @param {number[]} amounts - Amount of each verification deposit made by stripe
 */
function verifyACH(amounts) {
    return makeTspRequest('VerifyACH', amounts);
}

function getOwnUnits() {
    return makeTspRequest('GetOwnUnits');
}

function getAppSettings() {
    return makeTspRequest('GetSettings')
        .then(settingList => ({ settings: settingList }));
}

function changeAppSetting(name, value, description) {
    return makeTspRequest(
        'ChangeSettings',
        [{ name: name, value: value, description: description }]
    );
}

export {
    createNewUser, activateUser, getUnitList,
    getUserStatus, getRentDue, getUserList,
    getOwnMaintRequest, getAllMaintRequests, getAllPayments, postMaintRequest,
    createNewUnit, editUnit, changeStatusMaintRequest,
    submitPaymentCardToken, payACH, setupACH, verifyACH,
    markPaymentPaid, getAllOwnUnitPayments,
    getOwnUnits,
    getAppSettings, changeAppSetting, setLocalCreds, localLogin,
    resetPassword
};