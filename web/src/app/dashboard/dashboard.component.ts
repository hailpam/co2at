import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  template: '<plotly-plot [data]="graph.data" [layout]="graph.layout"></plotly-plot>'
})

export class DashboardComponent {
  constructor(private router: Router, private dataService: DataService) { }

  user = {
    name: '',
    surname: '',
    role: '',
    company: ''
  };

  ngOnInit(): void {
    const user = sessionStorage.getItem('user')
    if (user !== null) {
      this.user = JSON.parse(user);
      this.dataService.getScopeTelemetryData(this.user.company).subscribe(
        (response) => {
          const deserialized = JSON.parse(JSON.stringify(response))
          const series = deserialized.results[0].series;
          let values = [];
          for (let serie of series) {
            console.log(serie);
            for (let value of serie.values) {
              values.push(value);
            }
          }
          
          let times = [];
          let scope1Values = [];
          let scope2Values = [];
          let scope3Values = [];
          let scopeTotValues = [];
          for (let value of values) {
            times.push(value[0]);
            scope1Values.push(value[1]);
            scope2Values.push(value[2]);
            scope3Values.push(value[3]);
            scopeTotValues.push(value[1] + value[2] + value[3]);
          }

          this.lineSeries1 = {
            data: [
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

          const avgScope1 = scope1Values.reduce((a, b) => a + b, 0) / scope1Values.length;
          const avgScope2 = scope2Values.reduce((a, b) => a + b, 0) / scope2Values.length;
          const avgScope3 = scope3Values.reduce((a, b) => a + b, 0) / scope3Values.length;
          const avgScopeTot = scopeTotValues.reduce((a, b) => a + b, 0) / scopeTotValues.length;

          this.gauge1.data[0].value = avgScope1;
          this.gauge2.data[0].value = avgScope2;
          this.gauge3.data[0].value = avgScope3
          
          this.pie1.data[1].values = [ avgScope1, avgScope2, avgScope3 ];

          this.indicator1.data[1].y = scopeTotValues;
          this.indicator1.data[0].value = avgScopeTot;
        },
        (error) => {
          console.log('Error fetching the Scope telemetry data...');
        });
    }
  }

  public gauge1 = {
    data: [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0.9,
        title: { text: "Scope1" },
        type: "indicator",
        mode: "gauge+number+delta"
      }
    ],
    layout: { 
      width: 320, 
      height: 240, 
      title: 'Average Emissions' 
    }
  };

  public gauge2 = {
    data: [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0.8,
        title: { text: "Scope2" },
        type: "indicator",
        mode: "gauge+number"
      }
    ],
    layout: { 
      width: 320, 
      height: 240, 
      title: 'Average Emissions' 
    }
  };

  public gauge3 = {
    data: [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0.5,
        title: { text: "Scope3" },
        type: "indicator",
        mode: "gauge+number"
      }
    ],
    layout: { 
      width: 320, 
      height: 240, 
      title: 'Average Emissions' 
    }
  };

  public indicator1 = {
    data: [
      {
        type: "indicator",
        mode: "number+delta",
        value: 492,
        delta: { reference: .5, valueformat: ".00f" },
        ticker: { showticker: true },
        vmax: 1,
        domain: { y: [0, 1], x: [0.25, 0.75] },
        title: { text: "CO2e Total" }
      },
      {
        y: [325, 324, 405, 400, 424, 404, 417, 432, 419, 394, 410, 426, 413, 419, 404, 408, 401, 377, 368, 361, 356, 359, 375, 397, 394, 418, 437, 450, 430, 442, 424, 443, 420, 418, 423, 423, 426, 440, 437, 436, 447, 460, 478, 472, 450, 456, 436, 418, 429, 412, 429, 442, 464, 447, 434, 457, 474, 480, 499, 497, 480, 502, 512, 492]
      }
    ],
    layout: { 
      width: 320, 
      height: 240, 
      title: 'Average Emissions',
      xaxis: { range: [0, 62] } 
    }
  };

  public lineSeries1 = {
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

  public pie1 = {
    data: [{
      values: [1.2, 0.8, 0.3],
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

}
