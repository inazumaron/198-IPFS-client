import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreviewComponent } from "./pages/preview/preview.component";

const routes: Routes = [
  { path: "view", component: PreviewComponent },
  { path: "", redirectTo: "/view", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
