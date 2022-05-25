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
  styleUrls: ['./dashboard.component.less'],
  template: '<plotly-plot [data]="graph.data" [layout]="graph.layout"></plotly-plot>'
})

export class DashboardComponent {
  constructor(private router: Router, public dialog: MatDialog, private dataService: DataService) { }

  user = {
    name: '',
    surname: '',
    role: '',
    company: ''
  };

  public graph = {
    data: [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 270,
        title: { text: "Speed" },
        type: "indicator",
        mode: "gauge+number"
      }
    ],
    layout: { width: 320, height: 240, title: 'A Fancy Plot' }
  };

  public graph1 = {
    data: [
      { x: [1, 2, 3], y: [2, 5, 3], type: 'line', mode: 'lines+points', name: 'test' },
    ],
    layout: {
      title: 'Title of the Graph',
      xaxis: {
        title: 'x-axis title'
      },
      yaxis: {
        title: 'y-axis title'
      }
    }
  }

  public graph2 = {
    data: [{
      values: [16, 15, 12],
      labels: ['CO2e Scope1', 'CO2e Scope2', 'CO2e Scope3'],
      domain: { column: 0 },
      name: 'GHG Emissions',
      hoverinfo: 'label+percent+name',
      hole: .4,
      type: 'pie'
    }, {
      values: [27, 11, 25],
      labels: ['CO2e Scope1', 'CO2e Scope2', 'CO2e Scope3'],
      text: 'CO2',
      textposition: 'inside',
      domain: { column: 1 },
      name: 'CO2 Emissions',
      hoverinfo: 'label+percent+name',
      hole: .4,
      type: 'pie'
    }],
    layout: {
      title: 'CHG Vs CO2e Breakdown',
      annotations: [
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'GHG',
          x: 0.17,
          y: 0.5
        },
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'CO2',
          x: 0.82,
          y: 0.5
        }
      ],
      height: 400,
      width: 600,
      showlegend: true,
      grid: { rows: 1, columns: 2 }
    }
  }

  public graph3 = {
    data: [
      {
        type: "sankey",
        orientation: "h",
        node: {
          pad: 15,
          thickness: 30,
          line: {
            color: "black",
            width: 0.5
          },
          label: ["Scope1", "Scope2", "Scope3", "East", "West", "ProductA", "ProductB"],
          // color: ["blue", "blue", "blue", "blue", "blue", "blue"]
        },

        link: {
          source: [0, 0, 1, 1, 2, 2, 4, 4, 3 ], 
          target: [3, 4, 3, 4, 3, 4, 5, 6, 6 ],
          value: [8, 4, 5, 2, 3, 6, 7, 7, 3 ]
        }
      }
    ],
    layout: {
      title: 'Emissions by Product and Region',
    }
  }

  public graph4 = {
    data: [{
      type: "sunburst",
      labels: ["Acme", "East", "West", "ProductA", "ProductB", "ProductA", "ProductB"],
      parents: ["", "Acme", "Acme", "East", "East", "West", "West"],
      values:  [10, 14, 12, 11, 11, 13, 13],
      // outsidetextfont: {size: 20, color: "#377eb8"},
      // leaf: {opacity: 0.4},
      // marker: {line: {width: 2}},
    }],
    layout: {
      title: 'Emissions by Product and Region',
      // margin: {l: 0, r: 0, b: 0, t: 0},
    }
  }

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

          this.graph1 = {
            data: [
              // { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
              { x: times, y: scope1Values, type: 'line', mode: 'lines+markers', name: 'CO2e Scope1' },
              { x: times, y: scope2Values, type: 'line', mode: 'lines+markers', name: 'CO2e Scope2' },
              { x: times, y: scope3Values, type: 'line', mode: 'lines+markers', name: 'CO2e Scope3' },
            ],
            layout: {
              title: 'CO2e Emissions over Time',
              xaxis: {
                title: 'time'
              },
              yaxis: {
                title: 'emissions'
              }
            }
          }
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
