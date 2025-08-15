import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { BackendService } from '../shared/services/backend.service';
import { Statistics, PricePoint } from '../shared/interfaces/statistics.interface';
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
  private chart!: Chart<'line', { x: number; y: number }[], number>;

  // Subscriptions for refreshing the Statistics and the Chart
  private subStats!: Subscription;
  private subChart!: Subscription;
  private freqStats: number = 300_000;  // in ms, 5 minutes
  private freqChart: number = 300_000;  // in ms, 5 minutes

  // Timescale of the X-axis of the Chart
  windowMins: number = 120;  // Not private to allow access in the template
  private stepSize: number = this.getStepSize(this.windowMins);

  // Persist the selected window across reloads
  private readonly STORAGE_KEY = 'cfrChartWindowMins';

  constructor(private backendService: BackendService) { }

  // --- Helpers ----------------------------------------------------------

  private getStepSize(minutes: number): number {
    if (minutes <= 4 * 60) return 5;
    if (minutes <= 12 * 60) return 15;
    if (minutes <= 24 * 60) return 30;
    return 60;
  }

  /** Single source of truth for changing the window. */
  private applyWindow(
    minutes: number,
    opts: { persist?: boolean; refresh?: boolean } = {}
  ) {
    this.windowMins = minutes;
    this.stepSize = this.getStepSize(minutes);

    if (opts.persist) {
      localStorage.setItem(this.STORAGE_KEY, String(minutes));
    }
    if (opts.refresh) {
      this.backendService.getCfrPriceHistory(minutes)
        .subscribe(data => this.buildChart(data, { animate: true })); // Animate on selector change
    }
  }

  /** Restore the window selection from localStorage, if available. */
  // This is called once on component init to restore the last used window.
  private restoreWindowMins() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;
    const minutes = Number(raw);
    if (Number.isFinite(minutes)) {
      this.applyWindow(minutes); // no persist/refresh here
    }
  }

  // --- Angular lifecycle ----------------------------------------------------

  ngOnInit(): void {
    // Restore the window selection before starting streams
    this.restoreWindowMins();

    // Start getting the Statistics periodically, starting immediately
    this.subStats = interval(this.freqStats)
      .pipe(startWith(0), switchMap(() => this.backendService.getStatistics()))
      .subscribe(stats => { this.statistics = stats; });
  }

  ngAfterViewInit(): void {
    // Once the view (and canvas) is ready, start getting price history periodically
    this.subChart = interval(this.freqChart)
      .pipe(
        startWith(0),
        switchMap(() => this.backendService.getCfrPriceHistory(this.windowMins))
      )
      .subscribe(data => this.buildChart(data));
  }

  ngOnDestroy(): void {
    this.subStats?.unsubscribe();
    this.subChart?.unsubscribe();
  }

  // --- UI handlers ----------------------------------------------------------

  // Change the time axis of the chart
  onWindowChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const minutes = Number(select.value);
    this.applyWindow(minutes, { persist: true, refresh: true });
  }

  // --- Chart rendering ------------------------------------------------------

  private buildChart(data: PricePoint[], opts: { animate?: boolean } = {}) {
    // Map to {x,y} and guard against NaNs
    const pointsAll = data
      .map(p => ({ x: new Date(p.timestamp).getTime(), y: Number(p.price_usd) }))
      .filter(pt => Number.isFinite(pt.y));

    // Compute window and snap to step boundaries
    const now = Date.now();
    const startRaw = now - this.windowMins * 60_000;
    const stepMs = this.stepSize * 60_000;
    const alignedMin = Math.floor(startRaw / stepMs) * stepMs;
    const alignedMax = Math.ceil(now / stepMs) * stepMs;

    // Keep only points inside the visible window
    const points = pointsAll.filter(pt => pt.x >= alignedMin && pt.x <= alignedMax);

    if (this.chart) {
      // Update in place: don't replace the whole scale object (avoids flicker)
      const scales = this.chart.options.scales as Record<string, any>;
      const x = scales['x'];
      x.min = alignedMin;
      x.max = alignedMax;

      (this.chart.data.datasets![0].data as any) = points;

      // Only animate (i.e. use transition 'default') if explicitly requested
      this.chart.update(opts.animate ? 'default' : 'none');
      return;
    }

    // Initial chart config
    const config: ChartConfiguration<'line', { x: number; y: number }[], number> = {
      type: 'line',
      data: {
        // No labels array—x comes from each point’s `x`
        datasets: [{
          label: 'CFR Price ($)',
          data: points,
          fill: false,
          borderColor: '#435BC7',
          borderWidth: 1,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 0,
          spanGaps: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,     // we supply {x,y}

        animation: { duration: 0 }, // default: instant
        transitions: {
          default: { animation: { duration: 600, easing: 'easeOutQuart' } }, // selector change (manual)
          none: { animation: { duration: 0 } }                               // periodic refresh (automatic)
        },

        layout: { padding: { bottom: 0, left: 9, right: 10 } },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            displayColors: false,
            callbacks: {
              title: (items: TooltipItem<'line'>[]) => {
                if (!items.length) return '';
                const dt = new Date(items[0].parsed.x as number);
                return format(dt, 'yyyy-MM-dd HH:mm');  // format without seconds
              },
              label: (ctx: TooltipItem<'line'>) => {
                const val = ctx.parsed.y as number;
                return `$${val.toFixed(6)}`;
              }
            }
          },
          legend: { display: false }
        },
        scales: {
          x: {
            type: 'time',
            min: alignedMin,
            max: alignedMax,
            time: {
              unit: 'minute',
              tooltipFormat: 'PPpp',
              displayFormats: { minute: 'HH:mm' }
            },
            ticks: {
              stepSize: this.stepSize,
              autoSkip: false,
              padding: 0
            },
            title: {
              display: false,
              text: 'Time',
              color: '#435BC7',
              font: { weight: 'bold' }
            },
            border: { display: true, color: '#475268', width: 1 },
            grid: { drawOnChartArea: false }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'CFR price ($)',
              color: '#435BC7',
              font: { weight: 'bold' }
            },
            ticks: {
              callback: (value: string | number) => {
                const num = typeof value === 'string' ? parseFloat(value) : value;
                return `$${Number(num).toFixed(4)}`;
              }
            },
            border: { display: true, color: '#475268', width: 1 }
          }
        }
      }
    };

    this.chart = new Chart(this.chartRef.nativeElement, config);
  }
}
