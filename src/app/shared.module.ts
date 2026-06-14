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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// Data Display
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
// Feedback
import { NzAlertModule } from 'ng-zorro-antd/alert';
// Icon
import { NzIconModule } from 'ng-zorro-antd/icon';

const NZ_MODULES = [
  NzLayoutModule,
  NzMenuModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzInputModule,
  NzRadioModule,
  NzCheckboxModule,
  NzSwitchModule,
  NzTableModule,
  NzPaginationModule,
  NzProgressModule,
  NzAlertModule,
  NzIconModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...NZ_MODULES],
  exports: [CommonModule, FormsModule, ...NZ_MODULES],
})
export class SharedModule {}
