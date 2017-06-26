import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './app/app.module.ngFactory'; // should be generated

export function main(): Promise<any> {

  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .catch((e) => {
    console.error(e);
    });
}
