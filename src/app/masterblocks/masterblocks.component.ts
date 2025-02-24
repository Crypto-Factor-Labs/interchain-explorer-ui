import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // To access ngIf etc in HTML
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  blocks: any[] = [
    { height: '68249864', timestamp: '12 seconds ago', hash: '0xABC123...' },
    { height: '68249865', timestamp: '15 seconds ago', hash: '0xDEF456...' },
    { height: '68249866', timestamp: '18 seconds ago', hash: '0xGHI789...' },
    { height: '68249867', timestamp: '21 seconds ago', hash: '0xJKL012...' },
    { height: '68249868', timestamp: '24 seconds ago', hash: '0xMNO345...' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Optionally, fetch real block data here.
  }
}
