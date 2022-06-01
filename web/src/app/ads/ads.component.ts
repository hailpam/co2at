import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.less']
})
export class AdsComponent implements OnInit {

  displayedColumns: string[] = [
    'created_at',
    'type',
    'product',
    'creator',
    'recipient',
    'nr_click',
    'acked',
    'saving',
    'scope',
    'actions'
  ];
  dataSource = new MatTableDataSource<AdElement>(AD_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      this.dataService.getAds(u.company).subscribe(
        (response) => {
          console.log(response);
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<AdElement>(deserialised);
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

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("");
  }

  onClick(element: AdsComponent) {
    this.router.navigateByUrl('/ad', { state: element });
  }
}

export interface AdElement {
  created_at: number,
  ad_id: string,
  type: string,
  product: string,
  graph_id: string,
  recommendation_id: string,
  creator: string,
  recipient: string,
  nr_click: number,
  acked: number,
  saving: number,
  scope: string
}

const AD_DATA: AdElement[] = [
  {
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
    scope: ''
  }
];