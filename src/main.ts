import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Enable Angular DI-based HTTP interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Register your interceptor for dependency injection
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApplicationInterceptor,
      multi: true
    }
  ]
});
