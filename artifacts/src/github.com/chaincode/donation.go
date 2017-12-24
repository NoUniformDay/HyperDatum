
package main

import (
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type Donation struct {
	DonationID string `json:"donationID"`
	OriginID string `json:"originID"`
	Timestamp int64 `json:"timestamp"`
	Items []struct {
		Name string `json:"name"`
		Quantity string `json:"quantity"`
		Category string `json:"category"`
	} `json:"items"`
}

// ============================================================================================================================
// Add Donation - writes a Collection asset to ledger for key collectionID (generated incrementally each function call)
// Takes args []string : args[0] being the string representation of the JSON object collection (The donation)
// ============================================================================================================================
func (s *SmartContract) addDonation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var d Donation
	json.Unmarshal([]byte(args[0]), &d) //args[0] = JSON String
	var key = d.DonationID;
	donationAsBytes, _ := json.Marshal(d)
	APIstub.PutState(key, donationAsBytes)

	return shim.Success(nil)
}
// ============================================================================================================================
// Get CollectionByID - get the Collection asset from ledger from the corresponding collectionID
// ============================================================================================================================
func (s *SmartContract) getDonationByID(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var id = args[0] //barcode/donationID
	donationAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {
		return shim.Error("Failed to get Collection - " + id)
	}
	return shim.Success(donationAsBytes) //
}
