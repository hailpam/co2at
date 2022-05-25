import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.less']
})
export class CertificatesComponent implements OnInit {

  constructor(private dataService: DataService) { }

  displayedColumns: string[] = [
    'created_at',
    'product',
    'producer',
    'provenance',
    'co2e_scope1',
    'co2e_scope2',
    'co2e_scope3',
    'actions'
  ];
  dataSource = new MatTableDataSource<CertificateElement>(CERTIFICATE_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      this.dataService.getCertificates(u.company).subscribe(
        (response) => {
          console.log(response);
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<CertificateElement>(deserialised);
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
}

export interface CertificateElement {
  created_at: number,
  product: string,
  producer: string,
  provenance: string,
  report_id: string,
  certificate_id: string,
  co2e_scope1: number,
  co2e_scope2: number,
  co2e_scope3: number
}

const CERTIFICATE_DATA: CertificateElement[] = [
  {
    created_at: 0,
    product: '',
    producer: '',
    provenance: '',
    report_id: '',
    certificate_id: '',
    co2e_scope1: 0.0,
    co2e_scope2: 0.0,
    co2e_scope3: 0.0
  }
];