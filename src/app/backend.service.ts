import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { PricePoint } from './shared/statistics.interface';

@Injectable({
  providedIn: 'root'  // Makes the BackendService available throughout the application,
})                    // no need to specify it explicitly as provider in other modules.
export class BackendService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    // URL to the API of the INTERCHAIN Explorer backend
    this.apiUrl = `${this.config.appBaseUrl}/api`;
  }

  // Methods to retrieve indexed MasterBlocks (i.e. blocks from the MasterChain)
  getMasterBlock(hash: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterchain/block?height_or_hash=${hash}`);
  }

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

  // Methods to retrieve indexed PartialBlocks (i.e. blocks from the PartialChains)
  getPartialBlock(hash: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/partialchain/block?hash=${hash}`);
  }

  // Methods to retrieve Statistics
  getStatistics(): Observable<any> {
    //console.log(">>> getStatistics")
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  getCfrPriceHistory(minutes = 60): Observable<PricePoint[]> {
    return this.http.get<PricePoint[]>(`${this.apiUrl}/statistics/cfr-price-history?minutes=${minutes}`);
  }
}
