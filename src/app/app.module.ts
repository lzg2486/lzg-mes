import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared.module';
import { AppComponent } from './app.component';
import { ProductionOrderComponent } from './pages/production-order/production-order.component';
import { MaterialDispatchComponent } from './pages/material-dispatch/material-dispatch.component';
import { WorkOrderComponent } from './pages/work-order/work-order.component';
import { DispatchComponent } from './pages/dispatch/dispatch.component';
import { ProcessingComponent } from './pages/processing/processing.component';
import { ReviewComponent } from './pages/review/review.component';
import { DispatchAssignComponent } from './pages/dispatch-assign/dispatch-assign.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    ProductionOrderComponent,
    MaterialDispatchComponent,
    WorkOrderComponent,
    DispatchComponent,
    ProcessingComponent,
    ReviewComponent,
    DispatchAssignComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
