import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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


@Output() outputLanguage = new EventEmitter<string>();
language: string ='';
languages: Readonly<string[]> = ['Angular', 'Java'];



onLanguageChange(language: string) {
this.outputLanguage.emit(language);
}
  
  
}
