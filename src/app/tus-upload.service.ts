import { Injectable } from '@angular/core';
import * as tus from 'tus-js-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TusUploadService {
  progress$ = new BehaviorSubject<number>(0);
  endpoint = 'http://localhost:8080/files';

  upload(file: File): void {
    const upload = new tus.Upload(file, {
      endpoint: this.endpoint,
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      onProgress: (uploaded, total) => {
        this.progress$.next(Math.floor((uploaded / total) * 100));
      },
      onSuccess: () => {
        this.progress$.next(100);
      },
      onError: (err) => {
        console.error('Upload error', err);
        this.progress$.next(0);
      }
    });
console.log("Starting upload with file:", file.name, "Size:", file.size);

    upload.start();
  }
}
