import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Layout
import { NzLayoutModule } from 'ng-zorro-antd/layout';
// Navigation
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
// General
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
// Data Entry
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// Data Display
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
// Feedback
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
// Overlay
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
// Other
import { NzSpinModule } from 'ng-zorro-antd/spin';

const NZ_MODULES = [
  // Layout & Navigation
  NzLayoutModule,
  NzMenuModule,
  NzBreadCrumbModule,

  // General
  NzButtonModule,
  NzDividerModule,
  NzSpaceModule,

  // Data Entry
  NzInputModule,
  NzInputNumberModule,
  NzSelectModule,
  NzRadioModule,
  NzCheckboxModule,
  NzSwitchModule,

  // Data Display
  NzTableModule,
  NzTagModule,
  NzProgressModule,
  NzBadgeModule,
  NzAvatarModule,

  // Feedback
  NzAlertModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,

  // Overlay
  NzDropDownModule,
  NzToolTipModule,
  NzPopconfirmModule,

  // Other
  NzSpinModule,
];

@NgModule({
  imports: [CommonModule, FormsModule, ...NZ_MODULES],
  exports: [CommonModule, FormsModule, ...NZ_MODULES],
})
export class SharedModule {}
