import axios from 'axios';


/**
 * Sends a request to the server to create a new user. All required user fields must be
 * specified as properties on the userData parameter. Returns a promise that resolves to one of:
 *  success -> {activationCode: string}
 *  failure -> {error: string}
 * @param {any} userData - A list of user properties required for a user account
 * @returns {Promise<any>}
 */
function createNewUser(userData) {
    return axios
        .post('/api/createUser', userData)
        .then(response => {
            if (response.status !== 200) throw Error('Could not access server to create user.');
            if (!response.data || !response.data.activationCode) throw Error('Unexpected response from server');
            return { activationCode: response.data.activationCode };
        }).catch(err => {
            console.log(err);
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
    return axios
        .post('/api/createUnit', unitData)
        .then(response => {
            if (response.status != 200) throw Error('Could not access server to create unit.');
            if (!response.data || !response.data.id) throw Error('Unexpected response from server');
            return response.data;
        }).catch(err => { 
            console.log(err);
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
 */
function editUnit(id, unitData) {
    var data = { ...unitData, id: id };
    if (data.user) data.users = [data.user];

    return axios
        .post('/api/editUnit', data)
        .then(response => {
            if (response.status != 200) throw Error('Could not access server to create unit.');
            if (!response.data || !response.data.id) throw Error('Unexpected response from server');
            return response.data;
        }).catch(err => { 
            console.log(err);
            return { error: (err || {}).toString() };
        });
}

/**
 * Assigns an activation code to a user. This must be done prior to the user's first login to allow the user to activate.
 * Resolves to {status: 'success'} or {error: string}
 * @param {{activationCode: string}} activationData - Object containing data necessary to activate an account
 * @returns {Promise<any>}
 */
function activateUser(activationData) {
    return axios
        .post('/api/activateUser/', activationData)
        .then(response => {
            if (response.status !== 200) throw Error('Could not access server to create user.');
            if (!response.data || !response.data.result) throw Error('Unexpected response from server');
            return response.data;
        }).catch(err => {
            console.log(err);
            return { error: (err || {}).toString() };
        })
}

/**
 * Retrieves a list of units. Returns a promise that resolves to
 * {units: {unitName: string, id: ?}[]} or rejects to Error
 * @returns {Promise<any>}
 */
function getUnitList() {
    return axios
        .get('/api/getUnitList')
        .then(response => response.data);
}

/**
 * Polls the server for the user's login status. Resolves to 
 * {status: 'logged out' | 'tenant' | 'admin'}
 */
function getUserStatus() {
    return axios
        .get('/api/userStatus')
        .catch(err => {
            console.log(err);
            return { data: { status: 'logged out' } };
        })
        .then(response => {
            return response.data;
        });
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
    return axios
        .get('/api/rentAmount')
        .then(response => response.data);
}

function getUserList() {
    return axios
        .get('/api/getUserlist')
        .then(response => response.data);
}

function getOwnMaintRequest () {
    return axios.get("/api/getOwnMaintRequest").then(response => response.data);
}

/**
 * Gets all maintenance requests from the server
 * @param {{open?: boolean} } options
 */
function getAllMaintRequests(options) {
    var requestOptions = {};
    if(options){
        if (options.open != undefined) requestOptions.where = { status: options.open };
    }

    return axios
        .post("/api/getAllMaintRequests", requestOptions)
        .then(response => response.data);
}


function completeMaintRequest(id) {
    // var requestOptions = {};
    // if(options){
    //     if (options.open != undefined) requestOptions.where = { status: options.open };
    // }

    return axios
        .post("/api/completeMaintRequest", { id : id })
        .then(response => response.data);
}


/**
 * Gets all paments from the server
 * @param {{paid?: boolean} } options
 */
function getAllPayments(options) {
    var requestOptions = {};
    if (options.paid != undefined) requestOptions.where = { paid: options.paid };

    return axios
        .post("/api/allPayments", requestOptions)
        .then(response => response.data);
}

function markPaymentPaid(id) {
    return axios
        .post('/api/markPaid', { id: id });
}

/**
 * Sends a request to pay invoice(s) via ACH. Returns {
 *      result: 'paid' | 'needs setup' | 'needs verification' | 'error'
 *      error?: string
 * }.
 * @param {number[]} invoiceNumbers - ID for Payment records to be paid
 }
 */
function payACH(invoiceNumbers) {
    return axios
        .post('/api/payACH', { invoiceList: invoiceNumbers })
        .catch(err => {
            console.log(err);
            return { result: 'error', error: err.toString() };
        });
}

/**
 * Requests an account be associated with the user for ACH transfers. Returns {
 *      result: 'success' | 'error',
 *      error?: string
 * }
 * @param {{name: string, accountType: string, accountNumber: string, accountRouting: string}} accountDetails - Account information
 */
function setupACH(accountDetails) {
    return axios
        .post('/api/setupACH', accountDetails)
        .catch(err => {
            console.log(err);
            return { result: 'error', error: err.toString() };
        });
}

/**
 * Requests an account be verified for ACH.
 * @param {number[]} amounts - Amount of each verification deposit made by stripe
 */
function verifyACH(amounts) {
    return axios
        .post('/api/verifyACH', amounts)
        .catch(err => {
            console.log(err);
            return { result: 'error', error: err.toString() };
        });
}

export {
    createNewUser, activateUser, getUnitList,
    getUserStatus, getRentDue, getUserList,
    getOwnMaintRequest, getAllMaintRequests, getAllPayments,
    createNewUnit, editUnit, completeMaintRequest,
    payACH, setupACH, verifyACH,
    markPaymentPaid, 
};