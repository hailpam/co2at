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