import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Statistics } from '../shared/master-chain.interface';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  statistics!: Statistics;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    // Fetch all statistics on component load
    this.backendService.getStatistics().subscribe((stats) => {
      this.statistics = stats;
    });
  }

}
