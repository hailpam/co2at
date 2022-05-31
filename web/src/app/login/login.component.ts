import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService, private _snackBar: MatSnackBar) { }
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  username = '';
  password = '';
  
  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user !== null) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    const userData = this.dataService.getUserData(this.username, this.password);
    userData.subscribe(
      (response) => {
        if (Object.keys(response).length !== 0) {
          sessionStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/dashboard']).then(
            () => {
              window.location.reload();
            }
          );;
        } else {
          this._snackBar.open('Login failed. Try again...', 'Dispose', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      },
      (error) => {
        console.error('Unable to authenticate the user: ' + error)
      });
  }

  cancel(): void {
    this.username = '';
    this.password = '';
  }
}
