import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { InfoComponent } from '../features/info/info.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'info', component: InfoComponent},
  {path: '**', component: HomeComponent}
]

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
