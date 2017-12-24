/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Routes/Donation');

var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');

exports.addDonation = function(req, res) {
	var donationJSONString = JSON.stringify(req.body);
	
	logger.info(donationJSONString);
	
	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addDonation', [donationJSONString], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		var response_body = {};
		response_body["transaction_id"] = message;
		res.status(200).send(JSON.stringify(response_body));
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};

exports.getDonationById = function(req, res) {
	var donationId = req.params.donationId;
	
	logger.info(donationId);
	
	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getDonationByID', [donationId], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		res.status(200).send(message);
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
}