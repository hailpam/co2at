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

import { NgxEchartsModule } from 'ngx-echarts';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { ProductsComponent } from './products/products.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ProfileDialogComponent,
    ProductsComponent
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
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    PlotlyModule,
    MatDialogModule,
    MatCardModule,
    MatPaginatorModule
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
