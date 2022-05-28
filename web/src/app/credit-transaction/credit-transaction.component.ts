import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-transaction',
  templateUrl: './credit-transaction.component.html',
  styleUrls: ['./credit-transaction.component.less']
})
export class CreditTransactionComponent implements OnInit {

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
