import { Component, ViewEncapsulation } from '@angular/core';

@Component( {
  encapsulation: ViewEncapsulation.None,
  selector : 'aot-app',
  styles: [
    require('./app.component.scss')
  ],
  template : require('./app.component.html')
})

export class AppComponent {
  private message: string = 'This is the app component';
}
