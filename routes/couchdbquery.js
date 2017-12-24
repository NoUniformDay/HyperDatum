"use strict";
/*
 * This javascript file has multiple functions
 * that wrap mango queries which operate on the 
 * couchdb instance which is connected to a blockchain peer.
 */

var NodeCouchDB = require('node-couchdb');

var couch = new NodeCouchDB();

// Get a document from the couchDB based on the id parameter.
exports.getDocumentByID = function(id){
	var mangoQuery = {
	    selector: {
	        "$eq": {_id: id} 
	    }
	};
	
	var parameters = {};
	
	return couch.mango("mychannel", mangoQuery, parameters)
	.then(function (data, headers, status){
		console.log("Query successful:", data);
		return data;
	});
}

// Method returns all donation records with items of the specified category.
function getDonationsByCategory(category){
	var mangoQuery = {
	  selector: {
			"data.items":{
		  		"$elemMatch" : { 
		  		  "category" : category
		  		}
			}
		}
	};
		
	var parameters = {};//parameter variable left blank
	
	return couch.mango("mychannel", mangoQuery, parameters)
	.then(function (data, headers, status){
		console.log("Query successful:", JSON.stringify(data.data.docs));
		return Object.keys(data.data.docs).length;
	}).catch(function(err){
		console.log("Error during query:", err);
		//return [];
	});
}
exports.getDonationsByCategory = getDonationsByCategory;
// Method returns an object with all of the donation categories and their corresponding amounts.
function getDonationCategoryBreakdown(req, res){
////	var dist = {
////		
////	}
////	
////	dist.MEDICINE = getDonationsByCategory("MEDICINE");
////	dist.FOOD = getDonationsByCategory("FOOD");
////	dist.INFRASTRUCTURE = getDonationsByCategory("INFRASTRUCTURE");
////	
////	res.send(dist);
////	
////	Promise.all(dist).then(function(data){
////		console.log("DISTRIBUTION", data);
////	});
//	
////	var categoryList = ["MEDICINE", "FOOD", "INFRASTRUCTURE"];
////	var breakdown = {};
////	
//	for(var i = 0; i < categoryList.length; i++){
//		breakdown[categoryList[i]] = getDonationsByCategory(categoryList[i])
//		.then(function(data){
//			var category = categoryList[i];
//			
//			if(data) {
//				return resolve({category: Object.keys(data).length});
//			} else {
//				return resolve({category: 0});
//			}
//			
//			if(data){
//				console.log("DataLength: " + Object.keys(data).length);
//				return new Promise(resolve, reject) {
//					return resolve(Object.keys(data).length);
//				};
//			}
//			else{
//				return 0;
//			}
//		}).catch(function(err){
//			console.log("Error during query:", err);
//		});
//	}
//	
//	//var promise_res = res;
//	Promise.all(breakdown).then(function(breakdown_x){
//		console.log(breakdown_x);
//		return JSON.stringify(breakdown_x);
//	});
}

exports.getDonationCategoryBreakdown = getDonationCategoryBreakdown;

// Method returns a map with the top 5 recipients that recieved spoiled goods and the amount of spoilage they received.
exports.getTop5Spoiled = function(){
	return exports.getAllTransactions().then(function(data){
		var transactions = {};
		
		// For every transaction document returned
		for(var i = 0; i < Object.keys(data).length; i++){
			// If the record has a donatorID
			if(data[i].data.donatorID){
				// If the donator id is already stored in the transaction map replace if new value is greater.
				console.log("Unusable:" + data[i].data.unusable)
				if(!isNaN(parseInt(data[i].data.unusable))){
					console.log("Passed is number test");
					if(transactions[data[i].data.donatorID]){
						console.log("Parse int: " + parseInt(data[i].data.unusable));
						console.log("donationID: " + data[i].data.donatorID)
						if(transactions[data[i].data.donatorID] < parseInt(data[i].data.unusable)){
							transactions[data[i].data.donatorID] = parseInt(data[i].data.unusable);
						}
					}else{// Else if the donator id isn't in the transaction map add it to the transaction map.
						console.log("Parse int" + parseInt(data[i].data.unusable));
						console.log("donationID: " + data[i].data.donatorID)
						transactions[data[i].data.donatorID] = parseInt(data[i].data.unusable);
						console.log("Transaction max unusable:", transactions[data[i].data.donatorID])
					}
				}
			}
			console.log("**" + i);
		}
		
		var top5Spoiled = {0:0, 1:0, 2:0, 3:0, 4:0};
		
		for(var key in transactions){
			console.log("Key:", key);
			console.log("Value", transactions[key]);
			for(var amkey in top5Spoiled){
				console.log("top5Key:", amkey);
				console.log("top5Value:", top5Spoiled[amkey])
				if(transactions[key] > top5Spoiled[amkey]){
					console.log("Swap detected");
					top5Spoiled[key] = transactions[key];
					delete top5Spoiled[amkey];
					break;
				}
			}
		}
		return top5Spoiled;
	});
}

// Method returns a map that maps the ids of the top 5 donators to the amount they donated.
exports.getTop5Donators = function(){
	
	return exports.getAllDonations().then(function(data){
		var donators = {};
		
		// For every transaction document returned
		for(var i = 0; i < Object.keys(data).length; i++){
			// If the record has a donatorID
			if(data[i].data.originID){
				// If the origin id is already stored in the transaction map add to this value.
				console.log("originID:" + data[i].data.originID)
			
				if(donators[data[i].data.originID]){
					donators[data[i].data.originID] += 1;
				}else{// Else if the donator id isn't in the transaction map add it to the transaction map.
					donators[data[i].data.originID] = 1;
				}
			}
			console.log("**" + i);
		}
		
		var top5Donators = {0:0, 1:0, 2:0, 3:0, 4:0};
		
		for(var key in donators){
			console.log("Key:", key);
			console.log("Value", donators[key]);
			for(var amkey in top5Donators){
				console.log("top5Key:", amkey);
				console.log("top5Value:", top5Donators[amkey])
				if(donators[key] > top5Donators[amkey]){
					console.log("Swap detected");
					top5Donators[key] = donators[key];
					delete top5Donators[amkey];
					break;
				}
			}
		}
		return top5Donators;
	});
}

// Method returns all documents in the mychannel DB
exports.getAllDocuments = function(){
	var mangoQuery = {
	    selector: {
		    	"_id":{
		    		"$gt" : null
		    	}
	    }
	};
		
	var parameters = {};//parameter variable left blank
	
	return couch.mango("mychannel", mangoQuery, parameters)
	.then(function (data, headers, status){
		console.log("Query successful:", JSON.stringify(data.data.docs));
		return data.data.docs;
	});
}

// Method returns all donation data in the mychannel DB
exports.getAllDonations = function(){
	var mangoQuery = {
	    selector: {
		    	"data.originID":{
		    		"$gt" : null
		    	}
	    }
	};
		
	var parameters = {};//parameter variable left blank
	
	return couch.mango("mychannel", mangoQuery, parameters)
	.then(function (data, headers, status){
		console.log("Query successful:", JSON.stringify(data.data.docs));
		return data.data.docs;
	});
}

// Method returns all transaction data in the mychannel DB
exports.getAllTransactions = function(){
	var mangoQuery = {
	    selector: {
		    	"data.donatorID":{
		    		"$gt" : null
		    	}
	    }
	};
		
	var parameters = {};//parameter variable left blank
	
	return couch.mango("mychannel", mangoQuery, parameters)
	.then(function (data, headers, status){
		console.log("Query successful:", JSON.stringify(data.data.docs));
		return data.data.docs;
	}).catch(function(err){
		console.log("Error during query:", err);
	});
}

//testing
exports.getAllDonations(); //--test passed
exports.getAllTransactions(); //--test passed
exports.getAllDocuments(); //--test passed
exports.getDonationsByCategory("MEDICINE"); //--test passed
//getDonationCategoryBreakdown(); //--test passed
(exports.getTop5Spoiled()).then(function(data){
	console.log(data);
}).catch(function(err){
	console.log("Error during query:", err);
}); //--test passed
(exports.getTop5Donators()).then(function(data){
	console.log(data);
}).catch(function(err){
	console.log("Error during query:", err);
}); //--test passed

