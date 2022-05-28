import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.less']
})
export class CertificateComponent implements OnInit {

  certQrCodeInfo = '';
  reportQrCodeInfo = '';

  certificate = {
    created_at: 0,
    producer: '',
    product: '',
    provenance: '',
    report_id: '',
    co2e_scope1: 0.0,
    co2e_scope2: 0.0,
    co2e_scope3: 0.0
  };

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state !== undefined && state !== null) {
      this.certificate = JSON.parse(JSON.stringify(state))
      this.certQrCodeInfo = this.certificate.product + this.certificate.producer + this.certificate.provenance + this.certificate.co2e_scope1 + this.certificate.co2e_scope2 + this.certificate.co2e_scope3;
      // TODO link report if present, and prepare the QR code for the report
      this.reportQrCodeInfo = this.certificate.report_id !== '' ? this.certificate.report_id : 'report';
    }
  }

  ngOnInit(): void {
    // single stats
    this.singleStatScope1.data[0].value = this.certificate.co2e_scope1;
    this.singleStatScope2.data[0].value = this.certificate.co2e_scope2;
    this.singleStatScope3.data[0].value = this.certificate.co2e_scope3;

    // network stats
    this.parallelCoordinatesBreakdown.data[0].dimensions[0].values[0] = this.certificate.co2e_scope1;
    this.parallelCoordinatesBreakdown.data[0].dimensions[1].values[0] = this.certificate.co2e_scope2;
    this.parallelCoordinatesBreakdown.data[0].dimensions[2].values[0] = this.certificate.co2e_scope3;

    // geolocation stats
    const coe2e = this.certificate.co2e_scope1 + this.certificate.co2e_scope2 + this.certificate.co2e_scope3;
    this.geoMapScopeTot.data[0].marker.size[0] = coe2e * 10;
    this.geoMapScopeTot.data[0].marker.color[0] = coe2e * 10;
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/certificates");
  }

  public singleStatScope1 = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Scope1" }
      }
    ],
    layout: { 
      width: 400, height: 250 
    }
  };

  public singleStatScope2 = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Scope2" }
      }
    ],
    layout: { 
      width: 400, height: 250 
    }
  };

  public singleStatScope3 = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Scope3" }
      }
    ],
    layout: { 
      width: 400, height: 250 
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
        label: 'Scope1',
        values: [ 0.2 ]
      }, {
        range: [0, 2],
        label: 'Scope2',
        values: [ 1.1 ]
      }, {
        range: [0, 2],
        label: 'Scope3',
        values: [ 0.7 ]
      }]
    }],
    layout: {
      width: 600
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
}
