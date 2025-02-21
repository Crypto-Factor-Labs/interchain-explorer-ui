import { Component } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-masterblock',
  standalone: true,
  imports: [],
  templateUrl: './masterblock.component.html',
  styleUrl: './masterblock.component.scss'
})
export class MasterBlockComponent {
  masterBlock: any;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    // Fetch master block data on component load
    this.backendService.getLatestMasterBlock().subscribe((data: any) => {
      this.masterBlock = data
    });
  }

}
