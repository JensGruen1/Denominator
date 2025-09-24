import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface DenominationMap {
[quantity:string]: string
}

interface ObjectAmountDenominationMap {
  amount: number,
  denomination: DenominationMap
}

interface DenominationResponse {
  amount: number;
  denomination: Record<string, number>;
}


@Component({
  selector: 'app-show-denomination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './show-denomination.component.html',
  styleUrl: './show-denomination.component.css'
})
export class ShowDenominationComponent {

@Input() language!: string;
showDenomination: boolean = false;
showComparison: boolean = false; 
test: string ='';
  //denomination: { [note: string]: string } = {};
    //transfersByDate: { [date: string]: Transfer[] } = {};

denomination: Map<number, number> = new Map();
denominationWithAmount: DenominationResponse = {amount: 0, denomination:{}};
//ObjectAmountDenominationMap = {amount:0, denomination: {} };  //0.00?

previousDenomination: Map<number, number> = new Map();
previousDenominationWithAmount: DenominationResponse = {amount:0, denomination: {} };

previousDenominationWithAmountIter: DenominationResponse = {amount:0, denomination: {} };

comparisonDenominationWithPreviousAmount: DenominationResponse = {amount:0, denomination: {} };


amount: number = 0.1;
currencyInCent: number[]= [20000,10000,5000,2000,1000,500,200,100,50,20,10,5,2,1];


//isCurrencyEuro: boolean = true;

ngOnChanges(changes: SimpleChanges): void {
if (changes['language']) {
//this.onLanguageChange(this.language, this.amount);
//this.showDenomination = true;
console.log(this.language);
}
 }

constructor(private http:HttpClient) {}




onSubmit() {
console.log(this.language, this.showDenomination);
if (this.language === 'Angular') {
//calculation by frontend
this.showDenomination = true;
this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
this.denominationWithAmount = this.calculateDenomination(this.amount);
this.previousDenominationWithAmountIter = this.denominationWithAmount;
console.log('denominationWithAmount: ' , this.denominationWithAmount );

if(this.previousDenominationWithAmount.amount !=0) { 
  this.showComparison = true;
  this.comparisonDenominationWithPreviousAmount = this.calculateComparison(this.denominationWithAmount, this.previousDenominationWithAmount);
}
  


} else if (this.language === 'Java') {
//calculation by backend
this.showDenomination = true;
this.http.get<DenominationResponse> (`http://localhost:8080/api/calculateDenomination/${this.amount}`).subscribe({
next: (data) => {
  this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
  this.denominationWithAmount = data;
  this.previousDenominationWithAmountIter = data;

if(this.previousDenominationWithAmount.amount !=0) {
  this.showComparison = true;
  this.http.post<DenominationResponse>('http://localhost:8080/api/calculateComparison',
   { current:this.denominationWithAmount,
     previous: this.previousDenominationWithAmount
   }
  ).subscribe({
    next: (response) => {
      this.comparisonDenominationWithPreviousAmount = response;
    }
  })
}


}
});


} else {
  console.log('Empty Case not yet implemented ' + this.amount);
  //this.denominationByCount = this.calculateDenomination();

}
}



calculateDenomination(amount:number):DenominationResponse {
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

denominationResponse.amount = this.amount;
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





getDenominationMapFromDenomationResponseObject(denominationResponse: DenominationResponse): [string, number][] {
  return Object.entries(denominationResponse.denomination)
   .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
}

getAmountFromDenominationResponseObject(): [string, number][] {
  return Object.entries(this.denominationWithAmount.amount)
}


onAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value || ''; 

  value = value.replace(/[^0-9.]/g, '');

  if (value.includes('.')) {
    const [intPart, decPart] = value.split('.');
    value = intPart + '.' + decPart.slice(0, 2);
  }
  input.value = value;

  this.amount = parseFloat(value) || 0;
}




}
