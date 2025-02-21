import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Makes the BackendService available throughout the application,
})                    // no need to specify it explicitly as provider in other modules.
export class BackendService {
  private apiUrl = 'http://localhost:3000/api';  // URL to the API of the InterChain-Backend

  constructor(private http: HttpClient) { }

  // Methods to fetch MasterBlocks (i.e. blocks from the MasterChain)
  getLatestMasterBlock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterchain/latest-block`);
  }

  // Add more methods to interact with other API endpoints as needed
}
