import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppService } from './app.service';
import { LayoutService } from './panel/layout/layout.service';
import { AlertService } from './services/alert.service';
import { CompanyService } from './services/company.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [':host { display: block; }']
})
export class AppComponent {
  isProfitCostVisible: boolean = false;
  constructor(private router: Router,
    private appService: AppService,
    private layoutService: LayoutService,
    public translationService: TranslationService,
    public alertService: AlertService,
    public companyService: CompanyService) {
    // Get Set Language
    this.translationService.getSetLang();

    // Subscribe to router events to handle page transition
    this.router.events.subscribe(this.navigationInterceptor.bind(this));

    // Disable animations and transitions in IE10 to increase performance
    if (typeof document['documentMode'] === 'number' && document['documentMode'] < 11) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -ms-animation: none !important;
          animation: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }`;
      document.head.appendChild(style);
    }
  }

  private navigationInterceptor(e: RouterEvent) {
    if (e instanceof NavigationStart) {
      // Set loading state
      document.body.classList.add('app-loading');
    }

    if (e instanceof NavigationEnd) {
      // Scroll to top of the page
      this.appService.scrollTop(0, 0);
    }

    if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
      // On small screens collapse sidenav
      if (this.layoutService.isSmallScreen() && !this.layoutService.isCollapsed()) {
        setTimeout(() => this.layoutService.setCollapsed(true, true), 10);
      }

      // Remove loading state
      document.body.classList.remove('app-loading');

      // Remove initial splash screen
      const splashScreen = document.querySelector('.app-splash-screen');
      if (splashScreen) {
        splashScreen['style'].opacity = 0;
        setTimeout(() => splashScreen && splashScreen.parentNode.removeChild(splashScreen), 300);
      }
    }
  }
}
