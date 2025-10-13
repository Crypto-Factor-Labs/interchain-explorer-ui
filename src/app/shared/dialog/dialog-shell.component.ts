import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from '../ui/panel.component';

/*
 * Use the PanelComponent as basis, and enhance it to be a Dialog
 * by adding a Close-button and ESC/Enter key handling 
 */

@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, PanelComponent],
  templateUrl: './dialog-shell.component.html',
  styleUrls: ['./dialog-shell.component.scss'],
})
export class DialogShellComponent {
  @Input() dialogTitle = '';

  // Forwarded to Panel
  @Input() logoSrc?: string;
  @Input() logoAlt = 'Logo';

  @Output() close = new EventEmitter<void>();

  // Ensure host never has a native title tooltip */
  @HostBinding('attr.title') hostTitle: null = null;

  // ESC / Enter close
  @HostListener('document:keydown.enter', ['$event']) onEnterKey() { this.close.emit(); }
  @HostListener('document:keydown.escape', ['$event']) onEscKey() { this.close.emit(); }
}
