import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import  {MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Post } from '../post';
import { DataService } from '../data/data.service';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})

export class DashboardComponent {
  constructor(private router: Router, public dialog: MatDialog, private dataService: DataService) {}

  user = {
    name: '',
    surname: ''
  };

  ngOnInit(): void {
    const user = sessionStorage.getItem('user')
    if (user !== null) {
      this.user = JSON.parse(user);
    }
  }

  displayedColumns = ['date_posted', 'title', 'category', 'delete'];
  dataSource = new PostDataSource(this.dataService);

  deletePost(id: number) {
      this.dataService.deletePost(id);
      this.dataSource = new PostDataSource(this.dataService);
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PostDialogComponent, {
      width: '600px',
      data: 'Add Post'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.dataService.addPost(result.data);
      this.dataSource = new PostDataSource(this.dataService);
    });
  }
}

export class PostDataSource extends DataSource<any> {
  constructor(private dataService: DataService) {
    super();
  }

  connect(): Observable<Post[]> {
    return this.dataService.getData();
  }

  disconnect() {}
}
