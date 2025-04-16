import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchBarComponent {
  searchHash = '';

  constructor(private searchService: SearchService) { }

  clearSearch() {
    this.searchHash = '';
  }

  onSearch() {
    this.searchService.searchBlock(this.searchHash);
  }
}
