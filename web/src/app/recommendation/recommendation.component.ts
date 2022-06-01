import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.less']
})
export class RecommendationComponent implements OnInit {

  recommendation = {
    created_at: 0,
    company: '',
    for: '',
    scope: '',
    summary: '',
    reference_id: '',
    recommendation_id: '',
    improvement: 0.0
  };

  constructor(private router: Router) { 
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state !== undefined && state !== null) {
      this.recommendation = JSON.parse(JSON.stringify(state));
      this.singleStatSaving.data[0].value = this.recommendation.improvement/6;

      // TODO for the remaining values...
      if (this.recommendation.scope === "Logistic") {
        this.barChartLogisticsSaving.data[1].y[0] = (100 - this.recommendation.improvement)/100 * this.barChartLogisticsSaving.data[1].y[0];
      }

      this.barChartTotSaving.data[1].y[0] = (100 - this.recommendation.improvement/6)/100 *  this.barChartTotSaving.data[1].y[0];
    }
  }

  ngOnInit(): void {
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/recommendations");
  }

  goToInbox(): void {
    this.router.navigateByUrl("/inbox");
  }

  public singleStatSaving = {
    data: [
      {
        type: "indicator",
        value: 20,
        delta: { reference: 3 },
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

  public barChartLogisticsSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Logistic',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Logistic',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Logistics%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartProducerSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Producer',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Producer',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Producer%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartRetailerSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Retailer',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Retailer',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Retailer3%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartSupplierSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Supplier',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Supplier',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Supplier3%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartWasteSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Waste',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Waste',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Waste3%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }

  public barChartTotSaving = {
    data: [
      {
        x: [ 'before' ],
        y: [100],
        name: 'Tot',
        type: 'bar'
      },
      {
        x: [ 'after' ],
        y: [100],
        name: 'Tot',
        type: 'bar'
      }
    ],
    layout: {
      title: 'Tot%, Before Vs After',
      width: 400,
      height: 400,
      barmode: 'group'
    }
  }
}
