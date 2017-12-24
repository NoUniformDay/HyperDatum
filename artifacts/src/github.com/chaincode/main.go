package main

import (

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"fmt"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

/*
 * The Init method is called when the Smart Contract "" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}
/*
 * The Invoke method is called as a result of an application request to run the Smart Contract ""
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "init" {
		return s.Init(APIstub)
	} else if function == "getDonationByID" {
	    return s.getDonationByID(APIstub, args)
	} else if function == "addDonation" {
		return s.addDonation(APIstub, args)
	} else if function == "getTransactionByID" {
	    return s.getTransactionByID(APIstub, args)
	} else if function == "addTransaction" {
		return s.addTransaction(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name, TRY AGAIN.")
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}
