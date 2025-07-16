import { Component } from '@angular/core';
import { TusUploadService } from './tus-upload.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tus-upload',
  standalone: true,
  templateUrl: './tus-upload.component.html',
  styleUrls: ['./tus-upload.component.css']
})
export class TusUploadComponent {
  selectedFile: File | null = null;
  progress$: Observable<number>;

  constructor(private uploadService: TusUploadService) {
    this.progress$ = this.uploadService.progress$;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input?.files?.[0] || null;
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.uploadService.upload(this.selectedFile);
    }
  }
}
