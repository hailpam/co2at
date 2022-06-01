import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.less']
})
export class InboxComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) {}

  displayedColumns: string[] = [
    'created_at',
    'company',
    'type',
    'brief',
    'reference',
    'actions'
  ];
  dataSource = new MatTableDataSource<NotificationElement>(NOTIFICATION_DATA);
  selection = new SelectionModel<NotificationElement>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    let user = sessionStorage.getItem('user');
    if (user !== null) {
      const u = JSON.parse(user);
      this.dataService.getNotifications(u.company).subscribe(
        (response) => {
          const deserialised = JSON.parse(JSON.stringify(response));
          this.dataSource = new MatTableDataSource<NotificationElement>(deserialised);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log('Fetching the recommendations: ' + error);
        }
      );
    }
  }

  onClick(element: NotificationElement) {
    if (element.type === "Ad") {
      this.dataService.getAdByIdentifier(element.company, element.reference_id).subscribe(
        (response) => {
          const ad = JSON.parse(JSON.stringify(response));
          console.log(ad);
          this.router.navigateByUrl('/ad', { state: ad });
        },
        (error) => {
          console.error('Unable to fetch the Ad: ' + error);
        }
      );
      return;
    }

    if (element.type == "Recommendation") {
      this.dataService.getRecommendationByIdentifier(element.company, element.reference_id).subscribe(
        (response) => {
          const recommendation = JSON.parse(JSON.stringify(response));
          console.log(recommendation);
          this.router.navigateByUrl('/recommendation', { state: recommendation });
        },
        (error) => {
          console.error('Unable to fetch the Recommendation: ' + error);
        }
      );
      return;
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

}

export interface NotificationElement {
  created_at: number,
  company: string,
  type: string,
  brief: string,
  reference: string,
  reference_id: string,
  notification_id: string
}

const NOTIFICATION_DATA: NotificationElement[] = [
  { created_at: 0, company: 'test', type: 'test', brief: 'test', reference: 'test', reference_id: 'test', notification_id: 'test' }
];