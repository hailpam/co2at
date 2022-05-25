import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements AfterViewInit {

  constructor(private dataService: DataService) { }

  displayedColumns: string[] = [
    'name',
    'type',
    'producer'
  ];
  dataSource = new MatTableDataSource<ProductElement>(PRODUCT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user != null) {
      const u = JSON.parse(user);
      const products = this.dataService.getProducts(u.company).subscribe(
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
      console.log(products);
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface ProductElement {
  name: string,
  type: string,
  producer: string
}

const PRODUCT_DATA: ProductElement[] = [
  { name: 'test', type: 'test', producer: 'test' }
];