import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../features/navbar/navbar.component';
import { ShowDenominationComponent } from '../features/show-denomination/show-denomination.component';

/**
 * Root component of the application.
 * Acts as the main container.
 */


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ShowDenominationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedLanguage: string ='';

/**
 * gets the proramming language from the navbar and sends it to the showDenomination component 
 * @param selectedLanguage gets the selected programming language from the chid component (navbar)
 */

  onLanguageChange(selectedLanguage:string) {
    this.selectedLanguage = selectedLanguage;

  }
}
