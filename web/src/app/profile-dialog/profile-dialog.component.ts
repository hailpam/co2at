import { Component, OnInit } from '@angular/core';

import { DataService } from '../data/data.service';
@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.less']
})
export class ProfileDialogComponent implements OnInit {

  user = {
    name: '',
    surname: '',
    role: '',
    company: ''
  };

  company = {
    name: '',
    address: '',
    country: ''
  };

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.dataService.getCompany(this.user.company).subscribe(
        (response) => {
          this.company = JSON.parse(JSON.stringify(response));
        },
        (error) => {
          console.error('Unable to fetch the company info: ' + error)
        }
      );
    }
  }
}
