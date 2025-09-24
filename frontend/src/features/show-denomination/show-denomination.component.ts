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
currency: number[]= [200,100,50,20,10,5,2,1,0.50,0.20,0.10,0.05,0.02,0.01];


//isCurrencyEuro: boolean = true;

ngOnChanges(changes: SimpleChanges): void {
if (changes['language']) {
//this.onLanguageChange(this.language, this.amount);
//this.showDenomination = true;
console.log(this.language);
}
 }

constructor(private http:HttpClient) {}



/* onSubmit() {
this.http.get<string> ('http://localhost:8080/api/test').subscribe({
  next: (data) => {
this.test =  data;
console.log('data from test: ' + data)

  }
})

} */




onSubmit() {
console.log(this.language, this.showDenomination);
if (this.language === 'Angular') {
//calculation by frontend
this.showDenomination = true;
this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
this.denominationWithAmount = this.calculateDenomination(this.amount);
this.previousDenominationWithAmountIter = this.denominationWithAmount;




 console.log('Angular not yet implemented ' + this.amount);
} else if (this.language === 'Java') {
//calculation by backend
this.showDenomination = true;
this.http.get<DenominationResponse> (`http://localhost:8080/api/calculateDenomination/${this.amount}`).subscribe({
next: (data) => {
  this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
  this.denominationWithAmount = data;
  this.previousDenominationWithAmountIter = data;

if(this.previousDenominationWithAmount.amount !=0) {
  console.log('in comparison with previous denomination: ', this.previousDenominationWithAmount);
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
return {amount:0, denomination: {}};
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
