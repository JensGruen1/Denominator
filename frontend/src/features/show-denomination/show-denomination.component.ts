import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenominationService } from '../../app/denominationService';


export interface DenominationResponse {
  amount: number;
  denomination: Record<string, number>;
}


/**
 * Main class which includes all important calculation and code
 * it takes the language from the Navbar via the AppComponent
 * If you enter an amount in the html /home this class calculates the denomination and
 * the changes from the previous calculation to the current calculation by clicking on Submit via onSubmit()
 * there are 2 options calculate with Java or Angular
 * when choosing Java it makes a request to Java which makes all calculations and passes this calculations back
 * to Angular with a RestController
 */



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

/**
 * initialization of all parameters
 * lanugage comes from navbar via AppComponent with an EventEmitter
 */

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

/**
 * Handles the denomination with the selected language.
 *
 * - If language is "Angular":
 *   Performs the calculation on the frontend using the calculation service.
 *   Updates the current and previous denomination states and, if available,
 *   triggers a comparison between the two.
 *
 * - If language is "Java":
 *   Delegates the calculation to the backend service:
 *     1. Sends an HTTP GET request to calculate the denomination for the current amount.
 *     2. If a previous denomination exists, sends an HTTP POST request to compare the
 *        current and previous denominations.
 *   Handles possible backend errors such as:
 *     - Status 0: No connection to the backend.
 *     - Status 400: Invalid or wrongly formatted input.
 *
 * - Else:
 *   There appears a message, that warns you to enter a programming language
 *   No calculation takes place
 *
 * Updates:
 * - `showDenomination`: whether to display the denomination result.
 * - `showComparison`: whether to display the comparison result.
 * - `denominationWithAmount` and `previousDenominationWithAmount`: track
 *   the current and previous responses.
 * - `errorMessage`: displays  possible error messages.
 */


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

/**
 * This method sorts the denomination by the largest note (in the case 200.00 is the highest)
 * @param denominationResponse The denomination with the amount
 * @returns sorted denomination
 */


getDenominationMapFromDenomationResponseObject(denominationResponse: DenominationResponse): [string, number][] {
  return Object.entries(denominationResponse.denomination)
   .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
}


/**
 * This methos controls the input of the amount
 * it deletes all input that is not a number and more than one dot. 
 * @param event  The input event triggered when the user types into the amount field. Comes from the (input) in the html.
 */


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

/**
 * Just clears possible error messages
 */

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.languageSelectionError = false;
      this.errorMessage ='';
    
    }, 5000);
  }


  
}
