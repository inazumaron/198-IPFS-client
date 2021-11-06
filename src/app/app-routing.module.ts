import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreviewComponent } from './preview/preview.component';
import { UploadComponent } from './upload/upload.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  { path: 'upload', component : UploadComponent },
  { path: 'view', component: PreviewComponent},
  { path: 'newFolder', component: PopupComponent},
  { path: '', redirectTo: '/view', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
