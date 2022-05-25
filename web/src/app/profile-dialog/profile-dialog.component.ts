import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
    }
  }
}
