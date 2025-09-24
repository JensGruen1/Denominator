import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../features/navbar/navbar.component';
import { ShowDenominationComponent } from '../features/show-denomination/show-denomination.component';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ShowDenominationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedLanguage: string ='';

  onLanguageChange(selectedLanguage:string) {
    this.selectedLanguage = selectedLanguage;

  }
}
