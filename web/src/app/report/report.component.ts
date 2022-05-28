import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/reports");
  }

  public singleStatScope1 = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 300 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Profit" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public geoMapScopeTot = {
    data: [{
      type: 'scattergeo',
      mode: 'markers',
      locations: ['FRA', 'DEU', 'RUS', 'ESP', 'USA'],
      marker: {
        size: [20, 30, 15, 10, 100],
        color: [10, 20, 40, 50, 100],
        cmin: 0,
        cmax: 50,
        colorscale: 'Greens',
        colorbar: {
          title: 'Some rate',
          ticksuffix: '%',
          showticksuffix: 'last'
        },
        line: {
          color: 'black'
        }
      },
      name: 'europe data'
    }],
    layout: {
      'geo': {
        'scope': 'europe',
        'resolution': 50
      }
    }
  }

  public parallelCoordinatesBreakdown = {
    data: [{
      type: 'parcoords',
      line: {
        color: 'blue'
      },

      dimensions: [{
        range: [1, 5],
        constraintrange: [1, 2],
        label: 'A',
        values: [1, 4]
      }, {
        range: [1, 5],
        label: 'B',
        values: [3, 1.5],
        tickvals: [1.5, 3, 4.5]
      }, {
        range: [1, 5],
        label: 'C',
        values: [2, 4],
        tickvals: [1, 2, 4, 5],
        ticktext: ['text 1', 'text 2', 'text 4', 'text 5']
      }, {
        range: [1, 5],
        label: 'D',
        values: [4, 2]
      }]
    }],
    layout: {
      width: 800
    }
  };
}
