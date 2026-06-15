import { Routes } from '@angular/router';
import { ProductionOrderComponent } from './pages/production-order/production-order.component';
import { MaterialDispatchComponent } from './pages/material-dispatch/material-dispatch.component';
import { WorkOrderComponent } from './pages/work-order/work-order.component';
import { DispatchComponent } from './pages/dispatch/dispatch.component';
import { ProcessingComponent } from './pages/processing/processing.component';
import { DispatchAssignComponent } from './pages/dispatch-assign/dispatch-assign.component';
import { ReviewComponent } from './pages/review/review.component';
import { WorkOrderDispatchComponent } from './pages/work-order-dispatch/work-order-dispatch.component';

export const routes: Routes = [
  { path: '', component: ProductionOrderComponent },
  { path: 'material-dispatch', component: MaterialDispatchComponent },
  { path: 'work-order', component: WorkOrderComponent },
  { path: 'dispatch', component: DispatchComponent },
  { path: 'processing', component: ProcessingComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'dispatch-assign', component: DispatchAssignComponent },
  { path: 'work-order-dispatch', component: WorkOrderDispatchComponent },
];
