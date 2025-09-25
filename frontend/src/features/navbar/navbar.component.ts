import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * A navigation bar to choose the programming language
 * the language is send via a Eventmitter from the navbar to the the show denomination component
 * optional:  further Tabs like Info, change currency
 */



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent {

  /**
   * passes the programming language to the parent component
   */

@Output() outputLanguage = new EventEmitter<string>();
language: string ='';
languages: Readonly<string[]> = ['Angular', 'Java'];


/**
 * Am method to take the selected programming language and pass it to the show denomination component
 * @param language is the programming lanugage for the calculation of the denomination here: Angular and Java
 */


onLanguageChange(language: string) {
this.outputLanguage.emit(language);
}
  
  
}
