import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.less']
})
export class RecommendationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToHome(): void {
    this.router.navigateByUrl("");
  }

  goBack(): void {
    this.router.navigateByUrl("");
  }

}
