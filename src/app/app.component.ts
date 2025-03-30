import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from './config.service';
import { StatisticsComponent } from './statistics/statistics.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, StatisticsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'INTERCHAIN Explorer';

  // The constructor of ConfigService will run, which validates the configuration
  constructor(private config: ConfigService) { }
}
