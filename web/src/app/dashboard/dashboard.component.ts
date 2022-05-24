import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';

import { Post } from '../post';
import { DataService } from '../data/data.service';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})

export class DashboardComponent {
  constructor(private router: Router, public dialog: MatDialog, private dataService: DataService) { }

  user = {
    name: '',
    surname: '',
    role: '',
    company: ''
  };

  chartOption1: EChartsOption = {}; 
  chartOption2: EChartsOption = {}; 
  chartOption3: EChartsOption = {}; 
  //  = {
  //   // title: {
  //   //   text: 'ECharts Getting Started Example'
  //   // },
  //   tooltip: {},
  //   legend: {
  //     data: ['sales']
  //   },
  //   xAxis: {
  //     data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
  //   },
  //   yAxis: {},
  //   series: [
  //     {
  //       name: 'sales',
  //       type: 'line',
  //       data: [5, 20, 36, 10, 10, 20]
  //     }
  //   ]
  // };

  ngOnInit(): void {
    const user = sessionStorage.getItem('user')
    if (user !== null) {
      this.user = JSON.parse(user);
      this.dataService.getScopeTelemetryData(this.user.company).subscribe(
        (response) => {
          const results = JSON.parse(JSON.stringify(response)).results[0].series[0];
          const metric = results.name;
          const columns = results.columns;
          const values = results.values;
          
          let times = [];
          let scope1Values = [];
          let scope2Values = [];
          let scope3Values = [];
          for (let value of values) {
            times.push(value[0]);
            scope1Values.push(value[1]);
            scope2Values.push(value[2]);
            scope3Values.push(value[3]);
          }

          this.chartOption1 = {
            tooltip: {},
            legend: {
              data: [ 'CO2e Scope1', 'CO2e Scope2', 'CO2e Scope3' ]
            },
            xAxis: {
              data: times
            },
            yAxis: {},
            series: [
              {
                name: 'CO2e Scope1',
                type: 'line',
                data: scope1Values
              },
              {
                name: 'CO2e Scope2',
                type: 'line',
                data: scope2Values
              },
              {
                name: 'CO2e Scope3',
                type: 'line',
                data: scope3Values
              }
            ]
          };
          this.chartOption2 = {
            tooltip: {},
            legend: {
              data: [ 'CO2e Scope2' ]
            },
            xAxis: {
              data: times
            },
            yAxis: {},
            series: [
              {
                name: 'CO2e Scope2',
                type: 'line',
                data: scope2Values
              }
            ]
          };
          this.chartOption3 = {
            tooltip: {},
            legend: {
              data: [ 'CO2e Scope3' ]
            },
            xAxis: {
              data: times
            },
            yAxis: {},
            series: [
              {
                name: 'CO2e Scope3',
                type: 'line',
                data: scope3Values
              }
            ]
          };
        },
        (error) => {
          console.log('Error fetching the Scope telemetry data...');
        });
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

  disconnect() { }
}
