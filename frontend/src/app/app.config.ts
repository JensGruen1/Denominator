import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';


/**
 * Defines all application routes.
 * - 'home': navigates to /home
 * - '**': wildcard route, redirects all unknown paths to /home
 */

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '**', component: HomeComponent}
]

/**
 * Global application configuration.
 * Provides:
 * - Zone change detection with event coalescing enabled 
 * - Router configuration with the defined routes.
 */


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
