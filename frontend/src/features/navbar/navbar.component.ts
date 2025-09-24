import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';




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

//
@Output() outputLanguage = new EventEmitter<string>();
language: string ='';
languages: Readonly<string[]> = ['Angular', 'Java'];

ngOnInit() {

}


onLanguageChange(language: string) {
this.outputLanguage.emit(language);
}
  
  

}
