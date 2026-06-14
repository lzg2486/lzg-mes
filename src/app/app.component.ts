import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  currentMenu = '生产订单';

  // 菜单数据
  menus = [
    { label: '生产订单', route: '/' },
    { label: '约料管理', route: '/material-dispatch' },
    { label: '工单生成', route: '/work-order' },
    { label: '派工管理', route: '/dispatch' },
    { label: '生产加工', route: '/processing' },
    { label: '工时审核', route: '/review' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveMenu();
    });
  }

  private updateActiveMenu(): void {
    const url = this.router.url;
    const item = this.menus.find(m => m.route === url);
    if (item) this.currentMenu = item.label;
  }

  onMenuClick(route: string): void {
    this.router.navigate([route]);
  }
}
