import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  certQrCodeInfo = 'certificate';
  reportQrCodeInfo = 'report';

  report = {
    created_at: 0,
    product: '',
    company: '',
    certificate_id: '',
    co2e_logistic: 0.0,
    co2e_producer: 0.0,
    co2e_retailer: 0.0,
    co2e_supplier: 0.0,
    co2e_waste: 0.0
  };

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.router.getCurrentNavigation()?.extras.state);
    if (state !== undefined && state !== null) {
      this.report = JSON.parse(JSON.stringify(state));
      this.reportQrCodeInfo = this.report.product + this.report.company;
      // TODO resolve certificate and bring in the details
      this.certQrCodeInfo = this.report.certificate_id !== '' ? this.report.certificate_id: 'report';
    }
  }

  ngOnInit(): void {
    // parallel statss
    this.parallelCoordinatesBreakdown.data[0].dimensions[0].values[0] = this.report.co2e_supplier;
    this.parallelCoordinatesBreakdown.data[0].dimensions[1].values[0] = this.report.co2e_producer;
    this.parallelCoordinatesBreakdown.data[0].dimensions[1].values[0] = this.report.co2e_retailer;
    this.parallelCoordinatesBreakdown.data[0].dimensions[1].values[0] = this.report.co2e_logistic;
    this.parallelCoordinatesBreakdown.data[0].dimensions[1].values[0] = this.report.co2e_waste;
    
    // single stats
    const co2e = this.report.co2e_logistic + this.report.co2e_producer + this.report.co2e_retailer + this.report.co2e_supplier + this.report.co2e_waste;
    this.singleStatTot.data[0].value = co2e;
    this.singleStatSupplier.data[0].value = this.report.co2e_supplier;
    this.singleStatProducer.data[0].value = this.report.co2e_producer;
    this.singleStatRetailer.data[0].value = this.report.co2e_retailer;
    this.singleStatLogistic.data[0].value = this.report.co2e_logistic;
    this.singleStatWaste.data[0].value = this.report.co2e_waste;

    // geomap stats
    this.geoMapScopeTot.data[0].marker.size[0] = co2e * 10;
    this.geoMapScopeTot.data[0].marker.color[0] = co2e * 10;
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/reports");
  }

  public singleStatTot = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "CO2e" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public singleStatSupplier = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Supplier" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public singleStatProducer = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Producer" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public singleStatRetailer = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Retailer" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public singleStatLogistic = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Logistic" }
      }
    ],
    layout: {
      width: 400, height: 250
    }
  };

  public singleStatWaste = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 1 },
        value: 220,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Waste" }
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
      locations: [ 'USA' ],
      marker: {
        size: [20],
        color: [20],
        cmin: 0,
        cmax: 50,
        colorscale: 'Reds',
        colorbar: {
          title: 'CO2e',
          ticksuffix: '%',
          showticksuffix: 'last'
        },
        line: {
          color: 'black'
        }
      },
      name: 'United States Data'
    }],
    layout: {
      'geo': {
        'scope': 'usa',
        'resolution': 50
      }
    }
  };

  public parallelCoordinatesBreakdown = {
    data: [{
      type: 'parcoords',
      line: {
        color: 'green'
      },
      dimensions: [{
        range: [0, 2],
        label: 'Supplier',
        values: [ 0.2 ]
      }, {
        range: [0, 2],
        label: 'Producer',
        values: [ 1.1 ]
      }, {
        range: [0, 2],
        label: 'Retailer',
        values: [ 0.7 ]
      }, {
        range: [0, 2],
        label: 'Logistics',
        values: [ 1.1 ]
      }, {
        range: [0, 2],
        label: 'Waste',
        values: [ 0.7 ]
      }
    ]
    }],
    layout: {
      width: 600
    }
  };
}
