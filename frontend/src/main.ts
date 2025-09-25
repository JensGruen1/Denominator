import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

/**
 *   Bootstraps the Angular application.
 *
 * - The `AppComponent` is set as the root component of the application.
 * - The `provideHttpClient()` function registers Angular's `HttpClient` as a global
 *   provider, making it available for dependency injection across the app.
 * - Any errors during bootstrap are caught and logged to the console.
 *
 */

  bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
}) .catch((err) => console.error(err));
