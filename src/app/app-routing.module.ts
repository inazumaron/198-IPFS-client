import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreviewComponent } from "./pages/preview/preview.component";
import { MainComponent } from "./pages/main/main.component";
import { SendComponent } from "./pages/send/send.component";
import { ReceiveComponent } from "./pages/receive/receive.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { PostSendComponent } from "./pages/post-send/post-send.component";
import { PostReceiveComponent } from "./pages/post-receive/post-receive.component";

const routes: Routes = [
  { path: "view", component: PreviewComponent },
  { path: "main", component: MainComponent},
  { path: "send", component: SendComponent},
  { path: "receive", component: ReceiveComponent},
  { path: "sent", component: PostSendComponent},
  { path: "received", component: PostReceiveComponent},
  { path: "error", component: ErrorPageComponent},
  { path: "", redirectTo: "/main", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
