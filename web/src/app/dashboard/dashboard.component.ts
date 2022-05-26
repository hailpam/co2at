import { Component } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
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
          let regions = new Map();
          for (let serie of series) {
            for (let value of serie.values) {
              values.push(value);
              if (!regions.has(serie.tags.region)) {
                regions.set(serie.tags.region, new Map());
              }
              if (!regions.get(serie.tags.region).has(serie.tags.product)) {
                regions.get(serie.tags.region).set(serie.tags.product, []);
              }
              regions.get(serie.tags.region).get(serie.tags.product).push(value);
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
              { x: times, y: scope1Values, type: 'scatter', mode: 'scatter+markers', name: 'CO2e Scope1' },
              { x: times, y: scope2Values, type: 'scatter', mode: 'scatter+markers', name: 'CO2e Scope2' },
              { x: times, y: scope3Values, type: 'scatter', mode: 'scatter+markers', name: 'CO2e Scope3' },
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
          
          // processing for the sankey

          let i = 0;
          let index = new Map();
          let labels = []
          for (let region of regions) {
            if (!index.has(region[0])) {
              index.set(region[0], i);
              i += 1;
              labels.push(region[0])
            }
          }
          for (let region of regions) {
            for (let product of region[1]) {
              if (!index.has(product[0])) {
                index.set(product[0], i);
                i += 1;
                labels.push(product[0]);
              }
            }
          }
          index.set('Scope1', i);
          i += 1;
          labels.push('Scope1');
          index.set('Scope2', i);
          i += 1;
          labels.push('Scope2');
          index.set('Scope3', i);
          labels.push('Scope3');
          
          let src = [];
          let dst = [];
          let val = [];
          for (let region of regions) {
            for (let product of region[1]) {
              src.push(index.get(region[0]));
              dst.push(index.get(product[0]));
              let avg = []
              for (let i = 0; i < product[1].length; i++) {
                avg.push(product[1][i][1] + product[1][i][2] + product[1][i][3]); 
              }
              val.push(avg.reduce((a, b) => a + b, 0) / avg.length);

              let j = 1;
              for (let scope of ['Scope1', 'Scope2', 'Scope3']) {
                avg = [];
                src.push(index.get(product[0]));
                dst.push(index.get(scope));
                for (let i = 0; i < product[1].length; i++) {
                  avg.push(product[1][i][j]);
                }
                val.push(avg.reduce((a, b) => a + b, 0) / avg.length);
                j += 1;
              }
            }
          }
          this.sankey1.data[0].node.label = labels;
          this.sankey1.data[0].link.source = src;
          this.sankey1.data[0].link.target = dst;
          this.sankey1.data[0].link.value = val;

          // processing for the sunburst
          let ids = []
          ids.push(this.user.company);
          let lbls = []
          lbls.push(this.user.company);
          let prnts = []
          prnts.push('');
          let vals = []
          vals.push(0);
          for (let region of regions) {
            let regionTot = 0;
            for (let product of region[1]) {
              let j = 1;
              let scopeX = 0;
              let scopeTot = 0;
              for (let scope of ['Scope1', 'Scope2', 'Scope3']) {
                ids.push(region[0] + product[0] + scope);
                lbls.push(scope);
                prnts.push(region[0] + product[0]);
                for (let i = 0; i < product[1].length; i++) {
                  scopeX += product[1][i][j];
                }
                vals.push(scopeX / product[1].length);
                scopeTot += scopeX / product[1].length;
                j += 1;
              }
              ids.push(region[0] + product[0]);
              lbls.push(product[0]);
              prnts.push(region[0]);
              vals.push(scopeTot);
              regionTot += scopeTot;
            }
            ids.push(region[0]);
            lbls.push(region[0]);
            prnts.push(this.user.company);
            vals.push(regionTot);
          }
          this.sanburst1.data[0].ids = ids;
          this.sanburst1.data[0].labels = lbls;
          this.sanburst1.data[0].parents = prnts;
          this.sanburst1.data[0].values = vals;
        },
        (error) => {
          console.error('Error fetching the Scope telemetry data...');
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
      // title: 'Average Emissions'
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
      // title: 'Average Emissions' 
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
      // title: 'Average Emissions' 
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
      // title: 'Average Emissions',
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

  public sankey1 = {
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
        },

        link: {
          source: [0, 0, 1, 1, 2, 2, 4, 4, 3 ], 
          target: [3, 4, 3, 4, 3, 4, 5, 6, 6 ],
          value: [8, 4, 5, 2, 3, 6, 7, 7, 3 ]
        }
      }
    ],
    layout: {
      title: 'Emissions Flows',
    }
  }

  public sanburst1 = {
    data: [{
      type: "sunburst",
      ids: [ "Acme", "East", "West", "E-ProductA", "E-ProductB", "W-ProductA", "W-ProductB", "E-P1-Scope1", "E-P1-Scope2", "E-P1-Scope3", "E-P2-Scope1", "E-P2-Scope2", "E-P2-Scope3", "W-P1-Scope1", "W-P1-Scope2", "W-P1-Scope3", "W-P2-Scope1", "W-P2-Scope2", "W-P2-Scope3" ],
      labels: [ "Acme", "East", "West", "ProductA", "ProductB", "ProductA", "ProductB", "Scope1", "Scope2", "Scope3", "Scope1", "Scope2", "Scope3", "Scope1", "Scope2", "Scope3", "Scope1", "Scope2", "Scope3" ],
      parents: [ "", "Acme", "Acme", "East", "East", "West", "West", "E-ProductA", "E-ProductA", "E-ProductA", "E-ProductB", "E-ProductB", "E-ProductB", "W-ProductA", "W-ProductA", "W-ProductA", "W-ProductB", "W-ProductB", "W-ProductB" ],
      values:  [ 0, 100, 200, 40, 59, 60, 30, 10, 10, 10, 20, 20, 20, 21, 13, 24, 33, 11, 23 ],
    }],
    layout: {
      title: 'Hierarchy of Emissions',
    }
  }

}
