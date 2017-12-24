/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Routes/Transaction');

var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');

exports.addTransaction = function(req, res) {
	var transactionJSONString = JSON.stringify(req.body);
	
	logger.info(transactionJSONString);
	
	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addTransaction', [transactionJSONString], 'admin', 'org1')
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

exports.getTransactionById = function(req, res) {
	var transactionId = req.params.transactionId;
	
	logger.info(transactionId);
	
	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getTransactionByID', [transactionId], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		res.status(200).send(message);
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
}