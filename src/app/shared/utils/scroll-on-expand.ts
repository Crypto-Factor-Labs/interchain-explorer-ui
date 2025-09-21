import type { AnimationEvent as NgAnimationEvent } from '@angular/animations';
import type { ElementRef } from '@angular/core';

export function scrollExpandedIntoView(
  listRef: ElementRef<HTMLElement> | undefined,
  e: NgAnimationEvent,
  offset = 8
): void {
  if (e.toState === 'void') return;
  const target = e.element as HTMLElement;
  const container = listRef?.nativeElement;

  if (container) {
    const c = container.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const isBelow = t.bottom > c.bottom;
    const isAbove = t.top < c.top;
    if (isBelow || isAbove) {
      const delta = isBelow ? (t.bottom - c.bottom + offset) : (t.top - c.top - offset);
      container.scrollTo({ top: container.scrollTop + delta, behavior: 'smooth' });
    }
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}
