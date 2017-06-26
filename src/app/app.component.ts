import { Component, ViewEncapsulation } from '@angular/core';

@Component( {
  encapsulation: ViewEncapsulation.None,
  selector : 'aot-app',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html'
})

export class AppComponent {
  public message: string = 'This is the app component';
}
