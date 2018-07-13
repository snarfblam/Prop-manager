/*
  
    Single-end-point interface.

    There is a single end-point here for all API calls. 'processRequest' receives the
    request from the router and sends a response. The request body and response are
    somewhat standardized. The logic is divided into numerous 'operations', each 
    formerly a separate API route.

    Each operation is identified by a string, specified in the request body by the
    'operation' property. Parameters for the operation are provided in the
    'parameters' property. Each operation specifies 'requirements', conditions
    that must be met to perform the operation (e.g. the user may need to be
    an admin). The operation also provides a function that accepts the user
    and parameters and returns a promise. 

    If an operation promise resolves to an object or value, a success response is
    served containing that object or value. If the promise rejects with a string,
    an error response is served with a code of 200. If the promise rejects with an
    Error object, an error response is served with a code of 500. If the request
    is invalid or refers to a non-existant operation, an error response is sent
    with a code of 400. If a requirement of the operation is not met, an error
    response is sent with a code of 403.

    Accepts a POST request with the following body (JSON encoded)
    {
        operation: string,
        parameters?: object
    }
    Provided that the request can be processed, the response take the following form:
    {
        status: string, // 'success', 'error', or an operation-specific value
        result?: any,
        error?: string,
    }

*/

/// Modules //////////////////////////////////////////////////////////
const db = require('../models');
const requirements = require('./requirements');
const tenantOps = require('./tenant');

/// Errors ///////////////////////////////////////////////////////////

const Err_BadRequest = "The request is not valid";
const Err_OperationUnknown = "The specified operation is not recognized";
/**
 * 
 * @param {Response} res 
 * @param {string} err 
 * @param {string} errDetail
 * @param {number} code 
 */
function sendError(res, err, errDetail, code) {
    var errorText = err;
    if (errDetail) errorText = `${err}: ${errDetail}`;

    res.status(code || 400);
    res.json({
        status: 'error',
        error: errorText,
    })
}

function NestError(outer, inner) {
    outer.innerError = inner;
    return outer;
}

/**
 * 
 * @param {Request} req http request, must have a body parsed as an object
 * @param {Response} res 
 * @param {Function} next 
 */

/// Process Requests /////////////////////////////////////////////////

// Collect all operations into a single object
var operations = {};
Object.assign(operations, tenantOps);

function processRequest(req, res, next) {
    if (!req.body || !req.body.operation) {
        sendError(res, Err_BadRequest, "operation not specified");
        return;
    }

    var opName = req.body.operation;
    var params = req.body.parameters || {};

    var operation = operations[opName];
    if (!operation) {
        sendError(res, Err_OperationUnknown, opName);
        return;
    }

    try {
        for (var iReq = 0; iReq < operation.requirements.length; iReq++) {
            var requirement = operation.requirements[iReq];
            if (!requirement.test(req, params)) {
                sendError(res, requirement.errorMessage, null, 403);
                return;
            }
        }

        operation.execute(req.user, params)
            .then(result => {
                res.json({
                    status: 'success',
                    result: result,
                });
            }).catch(err => {
                console.log("API error", err);

                var status = 200;
                var errMsg = (err == null) ? '' : err.toString();

                if (err instanceof Error) {
                    status = 500;
                    errMsg = err.message;
                }

                res.json({
                    status: 'error',
                    error: errMsg,
                })
            })
    } catch (err) {
        console.error("Unhandled API error", err);
        if (!res.headersSent) res.status(500);
        if (!res.finished) res.json({
            status: "error",
            error: "unexpected internal error"
        });
    }
}


/// Operations ///////////////////////////////////////////////////////



// // Collection of operations that can be performed via the API.
// // Each operation specifies a set of requirements that must be met
// // for the operation to be attempted. Each operation has a method,
// // 'execute', that returns a promise that resolves to an object
// // that will be sent as the response data.
// var operations = {
//     PostMaintenanceRequest: {
//         requirements: [requirements.tenant],
//         execute: function (user, params) {
//             return user.getUnits().then(units => {
//                 if (units.length == 0) throw Error("User not associated with a unit.");

//                 var data = {
//                     message: params.message,
//                     UnitId: units[0].id,
//                 };
//                 return db.Maintenance.create(data);
//             }).then(model => {
//                 return model.get({ plain: true });
//             }).catch(err => {
//                 throw NestError(Error('Could not create maintenace item: ' + err.message), err);
//             });
//         }
//     }
// }

/// Exports //////////////////////////////////////////////////////////

module.exports = {
    // requirements: requirements,
    processRequest: processRequest,
}