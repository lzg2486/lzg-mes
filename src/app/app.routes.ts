import { Routes } from '@angular/router';
import { ProductionOrderComponent } from './pages/production-order/production-order.component';
import { WorkOrderComponent } from './pages/work-order/work-order.component';
import { DispatchComponent } from './pages/dispatch/dispatch.component';
import { ProcessingComponent } from './pages/processing/processing.component';
import { ReviewComponent } from './pages/review/review.component';

export const routes: Routes = [
  { path: '', component: ProductionOrderComponent },
  { path: 'work-order', component: WorkOrderComponent },
  { path: 'dispatch', component: DispatchComponent },
  { path: 'processing', component: ProcessingComponent },
  { path: 'review', component: ReviewComponent },
];
