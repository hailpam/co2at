import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';

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
    surname: '',
    role: '',
    company: ''
  };

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

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
