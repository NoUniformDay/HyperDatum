'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var hfc = require('fabric-client');
var path = require('path');
var util = require('util');
var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');

var jsonArgs = {

		"donationID" : "33223343",

		"originID" : "UNICEF",

		"timestamp" : 12131323123,

		"items" : [

		{"name" : "Malaria Vaccine", "quantity" : "50", "unusable" : "0","category" : "MEDICINE"},

		{"name" : "Malaria Pills", "quantity" : "500", "unusable" : "5","category" : "MEDICINE"},

		]

}


//============================================================================================================================
//API POST : 'api/blockbia/addCollection' :  Add collection
//Takes data from AJAX POST request in parseForms.js and commits waste data JSON to blockchain
//============================================================================================================================

	console.log("PING1");
	var collectionJSONString = JSON.stringify(req.body);
	console.log("Collection JSON string : "+collectionJSONString);
	
	
	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addDonation', [jsonArgs], 'admin', 'org1')
	.then(function(message) {
		
		var response_body = {};
		response_body["transaction_id"] = message;
		res.status(200).send(JSON.stringify(response_body));
	}, function(error) {
		
		res.status(500).send(error);
	});

