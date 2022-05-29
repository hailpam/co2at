import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-credit-transaction',
  templateUrl: './credit-transaction.component.html',
  styleUrls: ['./credit-transaction.component.less']
})
export class CreditTransactionComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }

  displayedColumns: string[] = [
    'created_at',
    'operation',
    'op_from',
    'op_to',
    'amount',
    'dollar'
  ];
  dataSource = new MatTableDataSource<TransactionElement>(TRANSACTION_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      this.dataService.getTransactions(u.company).subscribe(
        (response) => {
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<TransactionElement>(deserialised);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Fetching the products data');
        }
      );

      this.dataService.getBalance(u.company).subscribe(
        (response) => {
          const deserialised = JSON.parse(JSON.stringify(response));
          this.singleStatTarget.data[0].value = deserialised.targets;
          this.singleStatCredits.data[0].value = deserialised.credits;
          this.singleStatDebits.data[0].value = deserialised.debits;
        },
        (error) => {
          console.error('Fetching the products data');
        }
      );

      this.dataService.getCreditTelemetryData().subscribe(
        (response) => {
          console.log(response);
          const deserialised = JSON.parse(JSON.stringify(response));
          let series = new Map();
          for (let serie of deserialised.results[0].series) {
            const key = serie.tags['institution'] +"@"+ serie.tags['region'];
            if (!series.has(key)) {
              series.set(key, []);
            }
            for (let value of serie.values) {
              series.get(key).push(value[1]);
            }
          }

          let times = []
          let times1 = [];
          const values = deserialised.results[0].series[0];
          console.log(values);
          let i = 0;
          for (let value of values.values) {
            times1.push(value[0]);
            times.push(i);
            i += 1;
          }
          
          this.lineSeries.data = [];
          for (let serie of series) {
            this.lineSeries.data.push(
              { 
                x: times, 
                y: serie[1], 
                type: 'line', 
                mode: 'lines+points', 
                name: serie[0] }
            );
          }
        },
        (error) => {
          console.error('Fetching the credit telemetry data');
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("");
  }

  public singleStatTarget = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Target" }
      }
    ],
    layout: { 
      width: 400, height: 250 
    }
  };

  public singleStatCredits = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Credit" }
      }
    ],
    layout: { 
      width: 400, height: 250 
    }
  };

  public singleStatDebits = {
    data: [
      {
        type: "indicator",
        mode: "number+gauge+delta",
        gauge: { shape: "bullet" },
        delta: { reference: 0.5 },
        value: 1,
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Debit" }
      }
    ],
    layout: { 
      width: 400, height: 250 
    }
  };

  public lineSeries = {
    data: [
      { x: [1, 2, 3], y: [2, 5, 3], type: 'line', mode: 'lines+points', name: 'test1' },
      { x: [0, 1, 2], y: [3, 4, 3], type: 'line', mode: 'lines+points', name: 'test2' },
    ],
    layout: {
      autosize: true,
      width: 1100,
      height: 500,
      title: 'Credits trends over time by Institution',
      xaxis: {
        title: 'credits'
      },
      yaxis: {
        title: 'time'
      }
    }
  };
}

export interface TransactionElement {
  created_at: number,
  operation: string,
  op_from: string,
  op_to: string, 
  amount: number,
  dollar: number
}

const TRANSACTION_DATA: TransactionElement[] = [
  { created_at: 0, operation: '', op_from: '', op_to: '', amount: 0.0, dollar: 0.0 }
];