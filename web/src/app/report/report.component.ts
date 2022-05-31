import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {

  certQrCodeInfo = 'certificate';
  reportQrCodeInfo = 'report';
  geoMapping = new Map();

  report = {
    created_at: 0,
    product: '',
    provenance: '',
    company: '',
    certificate_id: '',
    report_id: '',
    co2e_logistic: 0.0,
    co2e_producer: 0.0,
    co2e_retailer: 0.0,
    co2e_supplier: 0.0,
    co2e_waste: 0.0
  };

  constructor(private router: Router, private dataService: DataService) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.router.getCurrentNavigation()?.extras.state);
    if (state !== undefined && state !== null) {
      this.report = JSON.parse(JSON.stringify(state));
      if (this.report.provenance === 'us-west') {
        this.geoMapping.set(this.report.provenance, 'CA');
      }
      if (this.report.provenance === 'us-east') {
        this.geoMapping.set(this.report.provenance, 'NY');
      }

      this.reportQrCodeInfo = this.report.product + this.report.company + this.report.co2e_supplier + this.report.co2e_logistic + this.report.co2e_producer + this.report.co2e_retailer + this.report.co2e_waste;
      // TODO resolve certificate and bring in the details
      this.certQrCodeInfo = this.report.certificate_id !== '' ? this.report.certificate_id: 'CertificateUnavailable';
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
    this.geoMapScopeTot.data[0].locations[0] = this.geoMapping.get(this.report.provenance);

    // get certificate data
    const user = sessionStorage.getItem('user');
    if (user !== null) {
      const u = JSON.parse(user);
      this.dataService.getCertificateByReport(u.company, this.report.report_id).subscribe(
        (response) => {
          const deserialised = JSON.parse(JSON.stringify(response));
          if (Object.keys(deserialised).length > 0) {
            this.certQrCodeInfo = deserialised.product + deserialised.producer + deserialised.provenance + deserialised.co2e_scope1 + deserialised.co2e_scope2 + deserialised.co2e_scope3;;
          }
        },
        (error) => {
          console.error('Fetching the report from the certificate: ', error)
        }
      );
    }

    // fetch the graph data
    this.dataService.getGraphData(this.report.company).subscribe(
      (response) => {
        const deserialized = JSON.parse(JSON.stringify(response));

        let productId = '';
        let vertices = new Map();
        let edges = new Map();
        for (let result of deserialized.result) {
          for (let vertex of result.vertices) {
            // store info
            if (!vertices.has(vertex._id)) {
              vertices.set(vertex._id, vertex);
              if (vertex.name === this.report.product) {
                productId = vertex._id;
              }
            }
            if (!edges.has(vertex._id)) {
              edges.set(vertex._id, new Set());
            }
          }

          // store relationships
          for (let edge of result.edges) {
            edges.get(edge._from).add(edge._to);
          }
        }

        // traversal: selected the spanning tree
        let selected = new Set();
        let stack = [];
        for (let edge of edges) {
          const key = edge[0];
          const value = edge[1];
          if (selected.has(key)) {
            continue;
          }
          if (key === productId) {
            selected.add(key);
            for (let v of value) {
              stack.push(v);
              selected.add(v);
            }
          }
          if (value.has(key)) {
            selected.add(key);
          }
          while (stack.length > 0) {
            const elem = stack.pop();
            for (let v of edges.get(elem)) {
              stack.push(v);
              selected.add(v);
            }
          }
        }

        let src = [];
        let tgt = [];
        let val = [];
        let lbl = [];
        let idx = new Map();
        let i = 0;
        for (let vertex of vertices) {
          const key = vertex[0];
          const value = vertex[1];
          if (selected.has(key)) {
            idx.set(value.name, i);
            lbl.push(value.name);
            i += 1;
          }
        }
        
        for (let edge of edges) {
          const key = edge[0];
          const value = edge[1];
          for (let cty of value) {
            if (selected.has(key) || selected.has(cty)) {
              src.push(idx.get(vertices.get(key).name));
              tgt.push(idx.get(vertices.get(cty).name));
              val.push(1);
            }
          }
        }

        this.sankey1.data[0].node.label = lbl;
        this.sankey1.data[0].link.source = src;
        this.sankey1.data[0].link.target = tgt;
        this.sankey1.data[0].link.value = val;
      },
      (error) => {
        console.error('Error fetching the graph data for the product', error);
      }
    );
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("/reports");
  }

  browseOnBlockchain(): void {
    window.open('https://www.blockchain.com/en/search?search=' + this.report.report_id, '_blank');
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
        title: { text: "Supply" }
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
        title: { text: "Produce" }
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
        title: { text: "Retail",  }
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
      locations: [ 'CA' ],
      locationmode: 'USA-states',
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
        label: 'Supply',
        values: [ 0.2 ]
      }, {
        range: [0, 2],
        label: 'Produce',
        values: [ 1.1 ]
      }, {
        range: [0, 2],
        label: 'Retail',
        values: [ 0.7 ]
      }, {
        range: [0, 2],
        label: 'Logistic',
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
          source: [0, 0, 1, 1, 2, 2, 4, 4, 3],
          target: [3, 4, 3, 4, 3, 4, 5, 6, 6],
          value: [8, 4, 5, 2, 3, 6, 7, 7, 3]
        }
      }
    ],
    layout: {
      title: 'Freezed Emissions Flows (at report time)',
      width: 1118,
      height: 772,
    }
  };
}
