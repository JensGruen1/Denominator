import { Injectable } from "@angular/core";


interface DenominationResponse {
  amount: number;
  denomination: Record<string, number>;
}


@Injectable({ providedIn: 'root' })
export class DenominationService {


currencyInCent: number[]= [20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1];

    calculateDenomination(amount:number):DenominationResponse {
    const newAmount: number = amount;
let quantity:number = 0;
const denominationMap:Record<number,number> = {};
const denominationResponse:DenominationResponse = {amount:0, denomination:{}};
  amount = Math.round(amount*100);

for ( const value of this.currencyInCent) {
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


calculateComparison(current: DenominationResponse, previous: DenominationResponse):DenominationResponse {
const comparisonMap:Record<number,number> = {};
const comparison:DenominationResponse = {amount:0, denomination:{}};

console.log('current denomination: ', current);

for (const [key,value] of Object.entries(previous.denomination)) {
    const numKey = Number(key);
    const numValue = Number(value);
    console.log(' key, value : ',numKey, numValue);
    comparisonMap[numKey] = -numValue;
    console.log(' in for loop1: ', comparisonMap);
}

console.log ('first step in comparison: ', comparisonMap);

for (const [key,value] of Object.entries(current.denomination)) {
    const numKey = Number(key);
    const numValue = Number(value);
    comparisonMap[numKey] = (comparisonMap[numKey] || 0 ) + value;

}
console.log('Angular comparison map: ', comparisonMap)
comparison.amount = previous.amount;
comparison.denomination = comparisonMap;

return  comparison;
}
    
}