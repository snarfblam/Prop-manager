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
        .get('/api/getUnitList');
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
export { createNewUser, activateUser, getUnitList, getUserStatus };