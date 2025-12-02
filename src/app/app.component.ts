import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { SearchBarComponent } from './searchbar/searchbar.component';
import { StatisticsComponent } from './statistics/statistics.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgIf, SearchBarComponent, StatisticsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'INTERCHAIN Explorer';
  showStatistics = false;

  constructor(
    private config: ConfigService,
    private router: Router
  ) {
    // Initial state on first load
    this.showStatistics = this.isHomeUrl(this.router.url);

    // React to navigation changes
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.showStatistics = this.isHomeUrl(e.urlAfterRedirects);
      });
  }

  // Determine if the given URL is the homepage
  // '/masterblocks' (currently?) acts as the homepage
  private isHomeUrl(url: string): boolean {
    const clean = url.split('?')[0];
    return clean === '/masterblocks' || clean === '/masterblocks/';
  }
}
