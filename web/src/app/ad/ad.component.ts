import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.less']
})
export class AdComponent implements OnInit {

  ad = {
    created_at: 0,
    ad_id: '',
    type: '',
    product: '',
    graph_id: '',
    recommendation_id: '',
    creator: '',
    recipient: '',
    nr_click: 0,
    acked: 0,
    saving: 0.0,
    scope: '',
    description: ''
  };

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state !== undefined && state !== null) {
      this.ad = JSON.parse(JSON.stringify(state));
      this.singleStatSaving.data[0].value = this.ad.saving;

      // TODO for the remaining values...
      if (this.ad.scope === "Logistic") {
        this.barChartScope3Saving.data[1].y[0] = (100 - this.ad.saving)/100 * this.barChartScope3Saving.data[1].y[0];
      }

      if (this.ad.scope === "Product") {
        this.barChartScope1Saving.data[1].y[0] = (100 - this.ad.saving/3)/100 * this.barChartScope1Saving.data[1].y[0];
        this.barChartScope2Saving.data[1].y[0] = (100 - this.ad.saving/3)/100 * this.barChartScope2Saving.data[1].y[0];
        this.barChartScope3Saving.data[1].y[0] = (100 - this.ad.saving/3)/100 * this.barChartScope3Saving.data[1].y[0];
      }
    }
  }

  ngOnInit(): void {
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/ads");
  }

  public singleStatSaving = {
    data: [
      {
        type: "indicator",
        value: 20,
        delta: { reference: 10 },
        gauge: { axis: { visible: true, range: [0, 100] } },
        domain: { row: 0, column: 0 }
      }
    ],
    layout: {
      width: 400,
      height: 250,
      template: {
        data: {
          indicator: [
            {
              title: { text: "CO2e Saving%" },
              mode: "number+delta+gauge",
              delta: { reference: 90 }
            }
          ]
        }
      }
    }
  };

  public barChartScope1Saving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Scope1',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Scope1',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Scope1%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartScope2Saving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Scope2',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Scope2',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Scope2%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartScope3Saving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Scope3',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Scope3',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Scope3%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }
}
