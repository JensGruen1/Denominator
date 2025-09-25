import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenominationService } from '../../app/denominationService';


export interface DenominationResponse {
  amount: number;
  denomination: Record<string, number>;
}

@Component({
  selector: 'app-show-denomination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './show-denomination.component.html',
  styleUrl: './show-denomination.component.css'
})
export class ShowDenominationComponent {

@Input() language!: string;
amount: number = 0;
showDenomination: boolean = false;
showComparison: boolean = false; 
languageSelectionError = false;
errorMessage = '';
denomination: Map<number, number> = new Map();
denominationWithAmount: DenominationResponse = {amount: 0, denomination:{}};
previousDenomination: Map<number, number> = new Map();
previousDenominationWithAmount: DenominationResponse = {amount:0, denomination: {} };
previousDenominationWithAmountIter: DenominationResponse = {amount:0, denomination: {} };
comparisonDenominationWithPreviousAmount: DenominationResponse = {amount:0, denomination: {} };



constructor(private http:HttpClient, private service:DenominationService) {}


onSubmit() {
if (this.language === 'Angular') {
//calculation by frontend
this.showDenomination = true;
this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
this.denominationWithAmount = this.service.calculateDenomination(this.amount);
this.previousDenominationWithAmountIter = this.denominationWithAmount;

if(this.previousDenominationWithAmount.amount !=0) { 
  this.showComparison = true;
  this.comparisonDenominationWithPreviousAmount = this.service.calculateComparison(this.denominationWithAmount, this.previousDenominationWithAmount);
}
  

} else if (this.language === 'Java') {
//calculation by backend

this.http.get<DenominationResponse> (`http://localhost:8080/api/calculateDenomination/${this.amount}`).subscribe({
next: (data) => {
  this.previousDenominationWithAmount= this.previousDenominationWithAmountIter;
  this.denominationWithAmount = data;
  this.previousDenominationWithAmountIter = data;
  this.showDenomination = true;

if(this.previousDenominationWithAmount.amount !=0) {
  this.showComparison = true;
  this.http.post<DenominationResponse>('http://localhost:8080/api/calculateComparison',
   { current:this.denominationWithAmount,
     previous: this.previousDenominationWithAmount
   }
  ).subscribe({
    next: (response) => {
      this.comparisonDenominationWithPreviousAmount = response;
    },
    error: (error) => {
          if (error.status === 0) {
          // Status 0 = kein Kontakt zum Backend
          this.errorMessage = '❌ No connection to server';
        } else if (error.status === 400) {
          this.errorMessage = '❌ One of the denonminations is null or has wrong format';
        }
  
    this.clearMessagesAfterDelay();
    }
  });
  
}
},
error: (error) => {
    if (error.status === 0) {
          this.errorMessage = '❌ No connection to server';
        } else if (error.status === 400) {
          this.errorMessage = '❌ String values are not allowed';
        }

  this.clearMessagesAfterDelay();


}
});


} else {
  console.log('Please choose a programming language ');
  this.languageSelectionError = true;
  this.clearMessagesAfterDelay();
}
}


getDenominationMapFromDenomationResponseObject(denominationResponse: DenominationResponse): [string, number][] {
  return Object.entries(denominationResponse.denomination)
   .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
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


  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.languageSelectionError = false;
    
    }, 5000);
  }


  
}
