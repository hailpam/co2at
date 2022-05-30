import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  qrCodeInfo = '';

  product = {
    name: '',
    type: '',
    producer: '',
    size: '',
    weight: '',
    packaging: '',
    price: 0.0
  };

  constructor(private router: Router, private dataService: DataService) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state !== undefined && state !== null) {
      this.product = JSON.parse(JSON.stringify(state));
      this.qrCodeInfo = this.product.name + this.product.producer + this.product.type;
    }
  }

  ngOnInit(): void {
    // fetch the telemetry data
    this.dataService.getScopeTelemetryDataByProduct(this.product.producer, this.product.name).subscribe(
      (response) => {
        const deserialized = JSON.parse(JSON.stringify(response));
        const series = deserialized.results[0].series;

        let scope1Values = [];
        let scope2Values = [];
        let scope3Values = [];
        let scopeTotValues = [];

        for (let serie of series) {
          for (let value of serie.values) {
            scope1Values.push(value[1]);
            scope2Values.push(value[2]);
            scope3Values.push(value[3]);
            scopeTotValues.push(value[1], value[2], value[3]);
          }
        }

        const avgTot = scopeTotValues.reduce((a, b) => a + b, 0) / scopeTotValues.length;
        this.indicator1.data[1].y = scopeTotValues;
        this.indicator1.data[0].value = avgTot;

        const avgScope1 = scope1Values.reduce((a, b) => a + b, 0) / scope1Values.length;
        const avgScope2 = scope2Values.reduce((a, b) => a + b, 0) / scope2Values.length;
        const avgScope3 = scope3Values.reduce((a, b) => a + b, 0) / scope3Values.length;
        this.pie1.data[0].values = [avgScope1, avgScope2, avgScope3];
      },
      (error) => {
        console.error('Error fetching the scope telemetry data for the product', error);
      }
    );

    // fetch the graph data
    this.dataService.getGraphData(this.product.producer).subscribe(
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
              if (vertex.name === this.product.name) {
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
    this.router.navigateByUrl("/products");
  }

  public indicator1 = {
    data: [
      {
        type: "indicator",
        mode: "number+delta",
        value: 1,
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
      xaxis: { range: [0, 62] }
    }
  };

  public pie1 = {
    data: [{
      values: [27, 11, 25],
      labels: ['CO2e Scope1', 'CO2e Scope2', 'CO2e Scope3'],
      text: 'CO2',
      textposition: 'inside',
      name: 'CO2 Emissions',
      hoverinfo: 'label+percent+name',
      hole: .4,
      type: 'pie'
    }],
    layout: {
      annotations: [
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'CO2',
        }
      ],
      height: 200,
      width: 300,
      showlegend: false,
      margin: { "t": 0, "b": 0, "l": 0, "r": 0 },
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
          source: [0, 0, 1, 1, 2, 2, 4, 4, 3],
          target: [3, 4, 3, 4, 3, 4, 5, 6, 6],
          value: [8, 4, 5, 2, 3, 6, 7, 7, 3]
        }
      }
    ],
    layout: {
      title: 'Product-specific Emissions Flows',
      width: 1118,
      height: 772,
    }
  }
}
