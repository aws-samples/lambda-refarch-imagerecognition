import {Component} from '@angular/core';
import {LoginService} from "./login.service";
import {Observable} from "rxjs";

@Component({
  selector: 'my-app',
  moduleId: module.id,
  templateUrl: 'app.component.html'
})
export class AppComponent {

  loggedIn: Observable<boolean>;
  loggedInUser: Observable<string>;

  constructor(private loginService: LoginService) {
    this.loggedInUser = loginService.getLoggedInUserObservable;
    this.loggedIn = this.loggedInUser.map((user: string) => (user && user.length > 0));
  }

}
