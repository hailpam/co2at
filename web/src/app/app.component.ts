import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CO2@';
  
  constructor(private router: Router, private _snackBar: MatSnackBar) {}
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = sessionStorage.getItem('user') !== null;
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this._snackBar.open('Logout successful!!', '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this.router.navigate(['/']).then(
      () => {
        // TODO find a way to refresh the app-root
        setTimeout(() => { window.location.reload() }, 700);
      }
    );
  }
}
