import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Layout & Navigation
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
// General
import { NzButtonModule } from 'ng-zorro-antd/button';
// Input
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// Data Display
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
// Feedback
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
// Drawer & Others
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';


const NZ_MODULES = [
  NzLayoutModule,
  NzMenuModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzInputModule,
  NzSelectModule,
  NzDatePickerModule,
  NzRadioModule,
  NzCheckboxModule,
  NzSwitchModule,
  NzTableModule,
  NzPaginationModule,
  NzProgressModule,
  NzTagModule,
  NzAlertModule,
  NzModalModule,
  NzDrawerModule,
  NzBadgeModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...NZ_MODULES],
  exports: [CommonModule, FormsModule, ...NZ_MODULES],
})
export class SharedModule {}
