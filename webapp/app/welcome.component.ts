import {Component, OnInit} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";


@Component({
  selector: 'welcome-page',
  moduleId: module.id,
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  username: string;

  ngOnInit(): void {
    this.loginService.clearLogin();
  }

  constructor(private router: Router,
              private loginService: LoginService) {
  }

  login(): void {
    this.loginService.login(this.username);
    this.router.navigateByUrl('/albumlist');
  }
}
