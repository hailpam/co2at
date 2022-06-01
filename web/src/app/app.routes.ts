import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdComponent } from './ad/ad.component';
import { AdsComponent } from './ads/ads.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CreditTransactionComponent } from './credit-transaction/credit-transaction.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { ReportComponent } from './report/report.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'ads', component: AdsComponent },
  { path: 'certificates', component: CertificatesComponent },
  { path: 'product', component: ProductComponent },
  { path: 'report', component: ReportComponent },
  { path: 'certificate', component: CertificateComponent },
  { path: 'credit', component: CreditTransactionComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'ad', component: AdComponent },
  { path: 'recommendation', component: RecommendationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouters {}