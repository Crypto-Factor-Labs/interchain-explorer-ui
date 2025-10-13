import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-icon',
  standalone: true,
  imports: [CommonModule, CdkCopyToClipboard],
  template: `
    <span class="icon-btn"
    (click)="debugClick()"
          [class.copied]="copiedState"
          [class.copy-error]="errorState"
          [cdkCopyToClipboard]="value"
          (cdkCopyToClipboardCopied)="onCopied($event)"
          [attr.aria-label]="ariaLabel"
          [attr.title]="title || null">
      <i [class]="iconClass"></i>
    </span>
  `,
  styleUrls: ['./copy-icon.component.scss'],
})
export class CopyIconComponent {
  @Input({ required: true }) value!: string; // Text to copy
  @Input() ariaLabel = 'Copy to clipboard';  // Screenreader label (no tooltip; use `title` for hover tooltip if desired)
  @Input() title: string | null = 'Copy';    // Hover tooltip text (default: "Copy"). Set to null or '' to hide tooltip
  @Input() iconClass = 'fa-solid fa-copy';   // Font Awesome class (defaults to solid copy)
  @Input() feedbackMs = 1000;                // How long the feedback shows (in ms)
  @Input() simulateError = false;            // For testing: if true, always signal copy failure

  @Output() copied = new EventEmitter<boolean>();

  // Keep track of copied state to change icon style
  copiedState = false;
  errorState = false;
  private timer?: any;

  onCopied(ok: boolean) {
    // Take the simulation toggle into account
    const result = this.simulateError ? false : ok;

    // Clear any prior feedback timer
    clearTimeout(this.timer);

    // Emit the (possibly simulated) outcome
    this.copied.emit(result);

    // Drive visual feedback
    if (result) {
      this.errorState = false;
      this.copiedState = true;
      this.timer = setTimeout(() => (this.copiedState = false), this.feedbackMs);
    } else {
      this.copiedState = false;
      this.errorState = true;
      this.timer = setTimeout(() => (this.errorState = false), this.feedbackMs);
    }
  }

  debugClick() { console.log('[copy-icon] click'); }

}
