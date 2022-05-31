import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DataService } from './data/data.service';

import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CO2@';
  
  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService, private _snackBar: MatSnackBar) {}
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  isLoggedIn = false;
  user = '';
  nrNotifications = 0;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.isLoggedIn = true;
      const u = JSON.parse(user);
      this.user = u.name;

      this.dataService.getNotifications(u.company).subscribe(
        (response) => {
          this.nrNotifications = JSON.parse(JSON.stringify(response)).length;
        },
        (error) => {
          console.log('Fetching the notifications: ' + error)
        }
      );
    }
  }

  logout(): void {
    sessionStorage.removeItem('user');
    // this._snackBar.open('Logout successful!!', '', {
    //   horizontalPosition: this.horizontalPosition,
    //   verticalPosition: this.verticalPosition,
    // });
    this.router.navigate(['/']).then(
      () => {
        // TODO find a way to refresh the app-root
        // setTimeout(() => { window.location.reload() }, 700);
        window.location.reload();
      }
    );
  }

  onProfileClick(): void {
    this.dialog.open(ProfileDialogComponent, {
      width: '600px',
      data: 'Add Post'
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToReports(): void {
    this.router.navigate(['/reports']);
  }

  goToAds(): void {
    this.router.navigate(['/ads']);
  }

  goToCertificates(): void {
    this.router.navigate(['/certificates']);
  }
  
  goToTransactCredits(): void {
    this.router.navigate(['/credit']);
  }

  goToInbox(): void {
    this.router.navigate(['/inbox']);
  }

  goToRecommendations(): void {
    this.router.navigate(['/recommendations']);
  }
}
