import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { Statistics, PricePoint } from '../shared/statistics.interface';
import type { TooltipItem, ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  statistics?: Statistics;

  // Grab the <canvas> from the template
  @ViewChild('cfrPriceChart', { static: true })
  private chartRef!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart<'line', number[], Date>;

  // Substribtions for refreshing the Statistics and the Chart
  private subStats!: Subscription;
  private subChart!: Subscription;
  private freqStats: number = 300_000;  // in ms, 5 minutes
  private freqChart: number = 300_000;  // in ms, 5 minutes

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    // Start getting the Statistics periodically, starting immediately (startWith(0))
    this.subStats = interval(this.freqStats)
      .pipe(
        startWith(0),
        switchMap(() => this.backendService.getStatistics())
      )
      .subscribe(stats => {
        this.statistics = stats;
      });
  }

  ngAfterViewInit(): void {
    // Once the view (and canvas) is ready, start getting price history periodically and build the Chart
    this.subChart = interval(this.freqChart)
      .pipe(
        startWith(0),
        switchMap(() => this.backendService.getCfrPriceHistory(60))
      )
      .subscribe(data => this.buildChart(data));

  }

  ngOnDestroy(): void {
    this.subStats.unsubscribe();
    this.subChart.unsubscribe();
  }

  private buildChart(data: PricePoint[]) {
    // Convert raw data into arrays of timestamps and numeric values
    const timestamps = data.map(p => new Date(p.timestamp));
    const values = data.map(p => parseFloat(p.price_usd));

    // Define the chart configuration object
    const config: ChartConfiguration<'line', number[], Date> = {
      type: 'line',  // we're drawing a line chart
      data: {
        labels: timestamps,  // X-axis labels are our time points
        datasets: [{
          label: 'CFR Price (USD)',  // legend label (hidden below)
          data: values,              // Y-axis data points
          fill: false,               // don’t fill under the line
          borderColor: '#435BC7',    // color of the line: byzantine-blue
          borderWidth: 1,            // thickness of the line
          tension: 0.3,              // curve tension (0 = straight lines, >0 = smooth)
          pointRadius: 0,            // hide individual data points for a clean line
        }]
      },
      options: {
        responsive: true,             // chart resizes with its container
        maintainAspectRatio: false,   // allow height/width to be controlled by CSS
        layout: {
          padding: { bottom: 20 }
        },
        plugins: {
          tooltip: {
            mode: 'index',            // show all datasets at hovered X
            intersect: false,         // show tooltip even if not exactly on a point
            displayColors: false,     // don't show a colored square that indicates the dataset (there is only one)
            callbacks: {
              // Format the tooltip title (the X value)
              title: (items: TooltipItem<'line'>[]) => {
                if (!items.length) return '';
                const dt = new Date(items[0].parsed.x as number);
                return format(dt, 'yyyy-MM-dd HH:mm');  // format without seconds
              },
              // Format the tooltip label (the Y value)
              label: (ctx: TooltipItem<'line'>) => {
                const val = ctx.parsed.y as number;
                return `$${val.toFixed(6)}`;  // format to 6 decimals
              }
            }
          },
          legend: {
            display: false            // hide the legend since we have only one dataset
          }
        },
        scales: {
          x: {
            type: 'time',              // interpret labels as dates/times
            time: {
              unit: 'minute',          // granularity of ticks
              tooltipFormat: 'PPpp',   // format in tooltip (e.g. “May 5, 2025, 8:37 AM”)
              displayFormats: {
                minute: 'HH:mm'        // format of axis labels (e.g. “08:37”)
              }
            },
            title: {                   // X-axis title
              display: true,
              text: 'Time',
              color: '#435BC7',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              drawOnChartArea: false   // only draw vertical grid lines (no background stripes)
            }
          },
          y: {
            beginAtZero: false,        // don’t force zero baseline if data >0
            title: {                   // Y-axis title
              display: true,
              text: 'Price (USD)',
              color: '#435BC7',
              font: {
                weight: 'bold'
              }
            },
            ticks: {
              callback: (value: string | number) => {
                // normalize to a number
                const num = typeof value === 'string' ? parseFloat(value) : value;
                // format to max 4 decimal places, then trim off trailing zeros (& the dot if needed)
                const str = num
                  .toFixed(4)              // e.g. "0.12340"
                //.replace(/\.?0+$/, '');  // e.g. "0.1234" or "1"
                return `$${str}`;
              }
            }
          }
        }
      }
    };

    if (this.chart) {
      // Update existing chart in place
      this.chart.options = config.options!; // ! because we know options is defined
      this.chart.data = config.data!;       // ! because we know data is defined
      this.chart.update();                  // re-render with new data/options
    } else {
      // Create chart for the first time
      this.chart = new Chart(this.chartRef.nativeElement, config);
    }
  }
}
