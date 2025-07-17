import { Component, NgZone } from '@angular/core';
import * as tus from 'tus-js-client';

@Component({
  selector: 'app-tus-upload',
  templateUrl: './tus-upload.component.html',
})
export class TusUploadComponent {
  selectedFile: File | null = null;
  progress = 0; // -1 hides the bar

  constructor(private zone: NgZone) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input?.files?.[0] || null;
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    const upload = new tus.Upload(this.selectedFile, {
      endpoint: 'http://localhost:8080/files',
      chunkSize: 5242880,
      metadata: {
        filename: this.selectedFile.name,
        filetype: this.selectedFile.type,
      },
      onProgress: (uploaded, total) => {
        const percent = (uploaded / total) * 100;
        this.zone.run(() => {
          console.log('progress %', percent);
          this.progress = percent;
        });
      },
      onSuccess: () => this.zone.run(() => this.progress = 100),
      onError: err => {
        console.error('Upload error', err);
        this.zone.run(() => this.progress = 0);
      }
    });

    upload.start();
  }
}
