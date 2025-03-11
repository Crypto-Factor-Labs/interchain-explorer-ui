import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Makes the BackendService available throughout the application,
})                    // no need to specify it explicitly as provider in other modules.
export class BackendService {
  private apiUrl = 'http://localhost:3000/api';  // URL to the API of the InterChain-Backend

  constructor(private http: HttpClient) { }

  // Methods to retrieve indexed MasterBlocks (i.e. blocks from the MasterChain)
  getLatestMasterBlock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterchain/latest-block`);
  }

  getMasterBlocks(nr: number, skip?: number, includePartialBlocks?: boolean): Observable<any> {

    let params = new HttpParams().set('nr', nr.toString());

    // If `skip` is provided, add it to the params
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }

    console.log(`includePartialBlocks = ${includePartialBlocks}`);

    // If `includePartialBlocks` is provided, add it to the params
    if (includePartialBlocks !== undefined) {
      params = params.set('includePartialBlocks', includePartialBlocks.toString());
    }

    // Make the GET request with the modified params
    return this.http.get(`${this.apiUrl}/masterchain/blocks`, { params });
  }

  // Add more methods to interact with other API endpoints as needed
}
