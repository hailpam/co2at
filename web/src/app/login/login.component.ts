import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DataService } from '../data/data.service';
import { delay } from 'rxjs-compat/operator/delay';

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
        console.log('response received')
        console.log(response)
        if (Object.keys(response).length !== 0) {
          sessionStorage.setItem('user', JSON.stringify(response));
          this._snackBar.open('Login successful!!', '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate(['/dashboard']).then(
            () => {
              // TODO find a way to refresh the app-root
              setTimeout(() => { window.location.reload() }, 700);
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
        console.error('Request failed with error')
      })
  }

  cancel(): void {
    this.username = '';
    this.password = '';
  }
}
