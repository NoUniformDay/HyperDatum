/*
 * GET home page.
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Routes/Index');

exports.indexPage = function(req, res) {
	res.render('index.html');
};