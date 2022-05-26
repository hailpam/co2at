import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.less']
})
export class ReportsComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  displayedColumns: string[] = [
    'created_at',
    'company',
    'product',
    'co2e_supplier',
    'co2e_retailer',
    'co2e_producer',
    'co2e_logistic',
    'co2e_waste',
    'actions'
  ];
  dataSource = new MatTableDataSource<ReportElement>(REPORT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      this.dataService.getReports(u.company).subscribe(
        (response) => {
          console.log(response);
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<ReportElement>(deserialised);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Fetching the products data');
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClick(element: ReportElement) {
    this.router.navigateByUrl('/report', { state: element });
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("");
  }
}

export interface ReportElement {
  created_at: number,
  company: string,
  product: string,
  graph_id: string,
  report_id: string,
  certificate_id: string,
  co2e_supplier: number,
  co2e_retailer: number,
  co2e_producer: number,
  co2e_logistic: number,
  co2e_waste: number
}

const REPORT_DATA: ReportElement[] = [
  {
    created_at: 0,
    company: '',
    product: '',
    graph_id: '',
    report_id: '',
    certificate_id: '',
    co2e_supplier: 0.0,
    co2e_retailer: 0.0,
    co2e_producer: 0.0,
    co2e_logistic: 0.0,
    co2e_waste: 0.0
  }
];