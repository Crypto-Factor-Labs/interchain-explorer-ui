import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
  transition(':enter', [
    style({ height: 0, opacity: 0, transform: 'translateY(-4px)', overflow: 'hidden' }),
    animate('{{enter}} cubic-bezier(0.2,0,0,1)', style({ height: '*', opacity: 1, transform: 'none' })),
  ], { params: { enter: '220ms' } }),
  transition(':leave', [
    style({ overflow: 'hidden' }),
    animate('{{leave}} cubic-bezier(0.4,0,0.2,1)', style({ height: 0, opacity: 0, transform: 'translateY(-4px)' })),
  ], { params: { leave: '180ms' } }),
]);

// Factory: choose selector + concrete timings (no params in `stagger`)
export function staggerItems(selector: string, delayMs = 30, dur = '160ms') {
  return trigger('staggerItems', [
    transition(':enter', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'translateY(6px)' }),
          stagger(delayMs, animate(dur, style({ opacity: 1, transform: 'none' }))),
        ],
        { optional: true }
      ),
    ]),
  ]);
}
