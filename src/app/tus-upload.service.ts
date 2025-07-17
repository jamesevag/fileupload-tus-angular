import { Injectable, NgZone } from '@angular/core';
import * as tus from 'tus-js-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TusUploadService {
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  private endpoint = 'http://localhost:8080/files';

  constructor(private zone: NgZone) {}

  upload(file: File): void {
    const upload = new tus.Upload(file, {
      endpoint: this.endpoint,
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      chunkSize: 5 * 1024 * 1024,
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = (bytesUploaded / bytesTotal) * 100;
        
        // FIX: run inside Angular zone to update view
        this.zone.run(() => this.progressSubject.next(percentage));
      },
      onSuccess: () => {
        this.zone.run(() => this.progressSubject.next(100));
      },
      onError: (err) => {
        console.error('Upload error', err);
        this.zone.run(() => this.progressSubject.next(0));
      }
    });

    upload.start();
  }
}
