import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// The app module
import { AppModule } from './app/app.module';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(): Promise<any> {

  if (process.env.NODE_ENV !== 'development') {
    enableProdMode();
  }

  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((e) => {
      console.error(e);
    });
}

if (process.env.NODE_ENV === 'development:hot') {
  // activate hot module reload
} else {
  // bootstrap when document is ready
  document.addEventListener('DOMContentLoaded', () => main());
}
