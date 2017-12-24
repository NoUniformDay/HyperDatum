
/**
 * Module dependencies.
 */

var express = require('express')
	, session = require('express-session')
	, bodyParser = require('body-parser')
	, index = require('./routes/index')
	, http = require('http')
	, path = require('path')
	, helper = require('./app/helper')
	, donation = require('./routes/donation')
	, transaction = require('./routes/transaction')
	, queryCouch = require('./routes/couchdbquery')

var app = express();
app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.options("*", function(req,res,next){
	res.send(200);
})
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
//redirect jQuery (depended by bootstrap)
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));

// redirect bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// redirect bootstrap dialog
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-dialog/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-dialog/dist/js'));

// redirect Angular.js
app.use('/js', express.static(__dirname + '/node_modules/'))

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//----------ROUTING---------------//
app.get('/', index.indexPage);

app.get('/api/donation/:donationId', donation.getDonationById);
app.post('/api/donation', donation.addDonation);

app.get('/api/transaction/:transactionId', transaction.getTransactionById);
app.post('/api/transaction', transaction.addTransaction);

app.get('/api/getDocumentByID/:id', queryCouch.getDocumentByID);
app.get('/api/getDonationsByCategory/:category', queryCouch.getDonationsByCategory);
app.get('/api/getDonationCategoryBreakdown', queryCouch.getDonationCategoryBreakdown);
app.get('/api/getTop5Spoiled/', queryCouch.getTop5Spoiled);
app.get('/api/getTop5Donators/', queryCouch.getTop5Donators);
app.get('/api/getAllDocuments/', queryCouch.getAllDocuments);
app.get('/api/getAllDonations/', queryCouch.getAllDonations);
app.get('/api/getAllTransactions/', queryCouch.getAllTransactions);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});