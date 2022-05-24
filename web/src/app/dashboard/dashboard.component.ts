import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";

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

  echartsOptions: EChartsOption = {
      tooltip: {
          trigger: "axis",
          axisPointer: {
          type: "shadow"
          }
      },
      grid: {
          containLabel: true
      },
      xAxis: {
          type: "value"
      },
      yAxis: {
          type: "category",
          data: ["sat", "sun", "mon", "tue", "wed", "thu", "fri"],
          axisLabel: {
          interval: 0,
          rotate: 15
          }
      },
      legend: {
          data: ["ali", "behrooz"],
          bottom: 0
      },
      series: [
      {
          name: "ali",
          type: "bar",
          data: [10, 15, 17, 4, 15, 31, 2]
      },
      {
          name: "behrooz",
          type: "bar",
          data: [1, 17, 12, 11, 40, 3, 21]
      }
      ]
  };

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
