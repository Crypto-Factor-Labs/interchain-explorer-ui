import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-standalone';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '../config.service';
import { BackendService } from '../backend.service';
import { DialogService } from '../shared/services/dialog.service';
import { MasterBlockComponent } from '../masterblock/masterblock.component';
import { MasterChainBlock } from '../shared/master-chain.interface'
import { PartialBlockComponent } from '../partialblock/partialblock.component';
import { PartialChainBlock } from '../shared/master-chain.interface';
import { getChainImage } from '../shared/utils';

@Component({
  selector: 'app-masterblocks',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './masterblocks.component.html',
  styleUrl: './masterblocks.component.scss'
})
export class MasterBlocksComponent implements OnInit {
  masterBlocks!: any[];
  expandedBlocks: { [id: string]: boolean } = {}; // For tracking for which MasterBlocks the PartialBlocks are shown
  dummyTransactions!: any[];
  errMsg: string = '';  // For displaying error messages if the data retrieval fails
  private pollingFreq: number = this.config.appPollFreq;  // In milliseconds
  private pollingTimeout: any;

  constructor(
    private config: ConfigService,
    private backendService: BackendService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    // Fetch MasterBlock data (including the related PartialBlocks)
    //console.log(">>> refreshData");
    this.backendService.getMasterBlocks(5, 0, true).pipe(
      catchError((error) => {
        this.errMsg = 'Failed to load MasterBlocks';
        console.error('Error loading MasterBlock data:', error);
        this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);  // Schedule the next refresh
        return of(null);  // Return a null observable to continue the execution
      })
    ).subscribe((blocks: any) => {
      if (blocks) {
        // Enrich the PartialBlocks with the timestamp of the MasterBlock
        blocks.forEach((block: any) => {
          block.partialBlocks = block.partialBlocks.map((pb: any) => ({
            ...pb,
            parentTimestamp: block.timestamp
          }));
        });

        this.masterBlocks = blocks;
        this.pollingTimeout = setTimeout(() => this.refreshData(), this.pollingFreq);  // Schedule the next refresh
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
    }
  }

  // Toggle visibility of PartialBlocks for the clicked MasterBlock
  togglePartialBlocks(blockHash: string): void {
    this.expandedBlocks[blockHash] = !this.expandedBlocks[blockHash];
  }

  // Tracking function used by ngFor to see if a MasterBlock is expanded
  trackByBlockHash(index: number, block: MasterChainBlock): string {
    return block.block_hash;
  }

  // Show the data of a MasterBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showMasterBlockData(block: MasterChainBlock): void {
    this.dialogService.openDialog(MasterBlockComponent, block);
  }

  // Show the data of a PartialBlock in a dialog on top of the current page
  // (so no routing to a new page!)
  showPartialBlockData(block: PartialChainBlock): void {
    this.dialogService.openDialog(PartialBlockComponent, block);
  }

  getChainImage(chainId: number): string {
    return getChainImage(chainId);  // Call the imported function
  }

  /* * *  TEMPORARY  * * */

  // Show videos in the panel that is meant for the Transactions

  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;

  videos = [
    { src: 'assets/videos/Interchain_Elegant_Reveal_1.mp4', name: "Elegant Reveal", isPlaying: false, isMuted: true },
    { src: 'assets/videos/Interchain_Layer_Emergence_2.mp4', name: "Layer Emergence", isPlaying: false, isMuted: true },
    { src: 'assets/videos/Interchain_Reveal_Powered_By_3.mp4', name: "Reveal Powered By", isPlaying: false, isMuted: true },
    { src: 'assets/videos/Interchain_Welders_Drip.mp4', name: "Welders Drip", isPlaying: false, isMuted: true },
  ];

  idxSelectedVideo: number | null = null;
  isVideoPlaying = false;
  isAutoplayEnabled = false;
  showControls = false;
  isMuted = true;

  selectVideo(index: number): void {
    this.idxSelectedVideo = index;
    this.showControls = true;

    setTimeout(() => {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.load();  // Force new video to load
      video.muted = this.isMuted;
      video.play().then(() => {
        this.isVideoPlaying = true;
        video.onended = () => {
          this.isVideoPlaying = false;
          this.showControls = false;
          if (this.isAutoplayEnabled) {
            // Loop through the videos
            const nextIndex = (this.idxSelectedVideo! + 1) % this.videos.length;
            this.selectVideo(nextIndex);
          }
        };
      });
    });
  }

  onAutoplayChanged(): void {
    if (this.isAutoplayEnabled) {
      // If no video is selected or playing, start from the current or first
      if (this.idxSelectedVideo === null || !this.isVideoPlaying) {
        const indexToPlay = this.idxSelectedVideo ?? 0;
        this.selectVideo(indexToPlay);
      }
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.videoElement) {
      const video = this.videoElement.nativeElement;
      video.muted = this.isMuted;
    }
  }

  /* END TEMPORARY */
}
