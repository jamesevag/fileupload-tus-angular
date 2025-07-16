import { bootstrapApplication } from '@angular/platform-browser';
import { TusUploadComponent } from './app/tus-upload.component';

bootstrapApplication(TusUploadComponent)
  .catch(err => console.error(err));