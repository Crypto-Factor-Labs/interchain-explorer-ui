import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [...SHARED_IMPORTS],
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
    this.searchService.search(this.searchHash);
  }
}
