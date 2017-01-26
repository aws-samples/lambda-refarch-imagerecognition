import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class LoginService {

  private loggedInUser: BehaviorSubject<string> = new BehaviorSubject<string>("");

  login(username: string): void {
    this.loggedInUser.next(username);
  }

  clearLogin(): void {
    this.loggedInUser.next(null);
  }

  get getLoggedInUserObservable(): Observable<string> {
    return this.loggedInUser.asObservable();
  }

  getLoggedInUserName(): string {
    return this.loggedInUser.getValue();
  }


  isUserLoggedin(): boolean {
    return (this.getLoggedInUserName() && this.getLoggedInUserName().length > 0);
  }
}
