import { Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  templateUrl: './dialog-shell.component.html',
  styleUrls: ['./dialog-shell.component.scss'],
})
export class DialogShellComponent {
  @Input() title = '';
  @Input() logoSrc = 'assets/images/interchain_logo.png';
  @Input() logoAlt = 'Interchain Logo';

  @Output() close = new EventEmitter<void>();

  // ESC / Enter close
  @HostListener('document:keydown.enter', ['$event']) onEnterKey() { this.close.emit(); }
  @HostListener('document:keydown.escape', ['$event']) onEscKey() { this.close.emit(); }
}
