
package main

import (
	"encoding/json"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type Transaction struct {
	DonatorID string `json:"donatorID"`
	DonationID string `json:"donationID"`
	Timestamp int64 `json:"timestamp"`
	Unusable string `json:"unusable"`
	RecipientName string `json:"recipientName"`
	Location struct {
		Longitude string `json:"longitude"`
		Latitude string `json:"latitude"`
	} `json:"location"`
}

var transactionID int = 0; //incremental value assigned to transactions

// ============================================================================================================================
// Add Donation - writes a Collection asset to ledger for key collectionID (generated incrementally each function call)
// Takes args []string : args[0] being the string representation of the JSON object collection (The donation)
// ============================================================================================================================
func (s *SmartContract) addTransaction(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var t Transaction
	json.Unmarshal([]byte(args[0]), &t) //args[0] = JSON String
	transactionAsBytes, _ := json.Marshal(t)
	APIstub.PutState("T"+strconv.Itoa(transactionID), transactionAsBytes)
	transactionID += 1
	return shim.Success(nil)
}
// ============================================================================================================================
// Get CollectionByID - get the Collection asset from ledger from the corresponding collectionID
// ============================================================================================================================
func (s *SmartContract) getTransactionByID(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var id = args[0] //barcode/donationID
	transactionAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {                                           
		return shim.Error("Failed to get Collection - " + id)
	}              
	return shim.Success(transactionAsBytes) //
}












		

