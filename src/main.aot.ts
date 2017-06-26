import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../generated/src/app/app.module.ngfactory'; // should be generated

export function main(): Promise<any> {

  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .catch((e) => {
    console.error(e);
    });
}
