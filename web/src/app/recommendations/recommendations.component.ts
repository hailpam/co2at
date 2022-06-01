import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.less']
})
export class RecommendationsComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }

  displayedColumns: string[] = [
    'created_at',
    'company',
    'for',
    'scope',
    'summary',
    'actions'
  ];
  dataSource = new MatTableDataSource<RecommendationElement>(RECOMMENDATION_DATA);
  selection = new SelectionModel<RecommendationElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    let user = sessionStorage.getItem('user');
    if (user !== null) {
      const u = JSON.parse(user);
      this.dataService.getRecommendations(u.company).subscribe(
        (response) => {
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<RecommendationElement>(deserialised);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log('Fetching the recommendations: ' + error);
        }
      );
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: RecommendationElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

  onClick(element: RecommendationElement) {
    this.router.navigateByUrl('/recommendation', { state: element });
  }
}

export interface RecommendationElement {
  created_at: number,
  company: string,
  for: string,
  scope: string,
  summary: string,
  reference_id: string,
  recommendation_id: string,
  position: number
}

const RECOMMENDATION_DATA: RecommendationElement[] = [
  { created_at: 0, company: 'test', for: 'test', scope: 'test', summary: 'test', reference_id: 'test', recommendation_id: 'test', position: 0 }
];