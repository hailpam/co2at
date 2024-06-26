import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRouters } from './app.routes';
import { DataService } from './data/data.service';
import { LoginComponent } from './login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgxEchartsModule } from 'ngx-echarts';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { QRCodeModule } from 'angularx-qrcode';
import { HighchartsChartModule } from 'highcharts-angular';

import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { ProductsComponent } from './products/products.component';
import { ReportsComponent } from './reports/reports.component';
import { AdsComponent } from './ads/ads.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { ProductComponent } from './product/product.component';
import { ReportComponent } from './report/report.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CreditTransactionComponent } from './credit-transaction/credit-transaction.component';
import { InboxComponent } from './inbox/inbox.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { AdComponent } from './ad/ad.component';
import { RecommendationComponent } from './recommendation/recommendation.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ProfileDialogComponent,
    ProductsComponent,
    ReportsComponent,
    AdsComponent,
    CertificatesComponent,
    ProductComponent,
    ReportComponent,
    CertificateComponent,
    CreditTransactionComponent,
    InboxComponent,
    RecommendationsComponent,
    AdComponent,
    RecommendationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AppRouters,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatCheckboxModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    PlotlyModule,
    MatDialogModule,
    MatCardModule,
    MatPaginatorModule,
    QRCodeModule,
    HighchartsChartModule
  ],
  providers: [
    DataService,
    MatCard
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ProfileDialogComponent
  ]
})
export class AppModule { }
