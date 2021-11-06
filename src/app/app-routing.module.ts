import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreviewComponent } from "./pages/preview/preview.component";
import { PopupComponent } from "./components/popup/popup.component";
import { UploadComponent } from "./pages/upload/upload.component";

const routes: Routes = [
  { path: "upload", component: UploadComponent },
  { path: "view", component: PreviewComponent },
  { path: "newFolder", component: PopupComponent },
  { path: "", redirectTo: "/view", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
