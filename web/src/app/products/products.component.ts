import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements AfterViewInit {

  constructor(private dataService: DataService, private router: Router) { }

  displayedColumns: string[] = [
    'name',
    'type',
    'producer',
    'size',
    'weight',
    'packaging',
    'price',
    'actions'
  ];
  dataSource = new MatTableDataSource<ProductElement>(PRODUCT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      this.dataService.getProducts(u.company).subscribe(
        (response) => {
          console.log(response);
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<ProductElement>(deserialised);
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

  onClick(element: ProductElement) {
    this.router.navigateByUrl('/product', { state: element });
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("");
  }
}

export interface ProductElement {
  name: string,
  type: string,
  producer: string,
  size: string,
  weight: string,
  packaging: string,
  price: number
}

const PRODUCT_DATA: ProductElement[] = [
  { name: 'test', type: 'test', producer: 'test', size: 'test', weight: 'test', packaging: 'test', price: 0.0 }
];