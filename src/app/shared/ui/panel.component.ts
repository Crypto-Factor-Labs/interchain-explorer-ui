import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,  // Let panel styles cascade to content
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  @Input() panelTitle = '';
  @Input() logoSrc?: string;
  @Input() logoAlt = 'Logo';
}
