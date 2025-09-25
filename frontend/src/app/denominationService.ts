import { Injectable } from "@angular/core";


interface DenominationResponse {
  amount: number;
  denomination: Record<string, number>;
}


/**
 * A service class to calculate the denominations and the changes from the previous denomination to the current one
 */


@Injectable({ providedIn: 'root' })       //marks class for DI with Singleton in the Root
export class DenominationService {


currencyInCent: number[]= [20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1]; //given currency to determine the denomination

/**
 * A method to calculate the denomiation of a given amount
 * @param amount is the amount for the denomination
 * @returns denominationResponse: DenominationsResponse which is the denomination and the amount, see interface above
 */


calculateDenomination(amount:number):DenominationResponse {

const newAmount: number = amount;
let quantity:number = 0;
const denominationMap:Record<number,number> = {};
const denominationResponse:DenominationResponse = {amount:0, denomination:{}};
amount = Math.round(amount*100);

if (amount === 0) {                          //prevent errors where the amount is 0, which cannot be denominated                                      
    return {amount: 0, denomination: {} };
}

for ( const value of this.currencyInCent) {             //loop the calculate the denomination
if (amount % value != amount && amount % value != 0) {
  quantity = Math.floor(amount/value);
  amount = amount % value;
  denominationMap[value/100] = quantity;
} else if (amount % value === 0) {
  quantity = Math.floor(amount/value);
  denominationMap[value/100] = quantity;
  break;
}
}

denominationResponse.amount = newAmount;
denominationResponse.denomination = denominationMap;

return denominationResponse;
} 

/**
 * A service method to calculate the changes from the previous DenominationResponse the current one
 * @param current is the DenominationResponse from the current denomination
 * @param previous  is the DenominationResponse from the previous denomination
 * @returns comparison:DenominationsResponse as the denomination the calculates the changes
 * from the previous denomination to the current one
 */


calculateComparison(current: DenominationResponse, previous: DenominationResponse):DenominationResponse {
const comparisonMap:Record<number,number> = {};
const comparison:DenominationResponse = {amount:0, denomination:{}};


for (const [key,value] of Object.entries(previous.denomination)) {   // just changes the sign of the value of the current denomination
    const numKey = Number(key);
    const numValue = Number(value);
    comparisonMap[numKey] = -numValue;
}


for (const [key,value] of Object.entries(current.denomination)) { // merges the entries of the previous and current denomination, just add all the values
    const numKey = Number(key);
    const numValue = Number(value);
    comparisonMap[numKey] = (comparisonMap[numKey] || 0 ) + value;

}

comparison.amount = previous.amount;
comparison.denomination = comparisonMap;

return  comparison;
}
    
}