import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'  // Makes the BackendService available throughout the application,
})                    // no need to specify it explicitly as provider in other modules.
export class BackendService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    // URL to the API of the InterChain-Backend
    this.apiUrl = `http://${this.config.appIp}:${this.config.appPort}/api`;
  }

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

    // If `includePartialBlocks` is provided, add it to the params
    if (includePartialBlocks !== undefined) {
      params = params.set('includePartialBlocks', includePartialBlocks.toString());
    }

    // Make the GET request with the modified params
    return this.http.get(`${this.apiUrl}/masterchain/blocks`, { params });
  }

  // Add more methods to interact with other API endpoints as needed
}
