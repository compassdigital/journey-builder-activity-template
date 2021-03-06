'use strict';
var util = require('util');
var voucherifyClient = require("voucherify");

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.hostname);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    // res.send(200, 'Edit');
    res.status(200).send('Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    // res.send(200, 'Save');
    res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log("***** original request from SMC");
    console.log(req);

    console.log("***** original body from SMC");
    console.log(req.body);
    
    console.log("***** headers *****");
    console.log(req.headers);

    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments            
            var decodedArgs = decoded.inArguments[0];
            console.log('execute()');
            console.log(decodedArgs);
            logData(req);
            // res.send(200, 'Execute');

            // voucherify info
            var voucherify_appid = process.env.voucherify_application_id;
            var voucherify_secret = process.env.voucherify_secret;

            var client = voucherifyClient({
                applicationId: voucherify_appid,
                clientSecretKey: voucherify_secret
            });

            // Lets create the customer, if it already exist, it should upsert the information provided
            var new_customer = {
                "name" : decodedArgs.FirstName + " " + decodedArgs.LastName,
                "email" : decodedArgs.EmailAddress,
                "description" : "Journey Builder created customer",
                "source_id": decodedArgs.EmailAddress,
                "metadata": {
                    "origin": "Journey",
                    [decodedArgs.PromoCode]: true
                }
            };

            // var code_key = decodedArgs.PromoCode;
            // new_customer.metadata[code_key] = true;

            client.customers.create(new_customer)
            .then((result) => {
                console.log('Voucherify: customer created for ' + decodedArgs.EmailAddress);
                console.log(result);
            })
            .catch((error) => {
                console.error("Voucherify Error - customers.create: %s", error);
            });

            res.status(200).send('Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // console.log( req.body );
    logData(req);
    // res.send(200, 'Publish');
    res.status(200).send('Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    // res.send(200, 'Validate');
    res.status(200).send('Validate');
};