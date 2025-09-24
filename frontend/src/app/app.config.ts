import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';

//import { routes } from './app.routes';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '**', component: HomeComponent}
]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
