import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	errorLog: boolean;

  constructor(public authService: AuthService) {
  	this.errorLog = false;
  }

  ngOnInit(): void {
  }

  login(username: string, password: string): boolean {
  	this.errorLog = false;
  	if (!this.authService.login(username, password)) {
  		this.errorLog = true;
  		setTimeout(function() {
  			this.errorLog = false;
  		}.bind(this), 2500);
  	}
  	return false;
  }

  logout(): boolean {
  	this.authService.logout();
  	return false;
  }

}
