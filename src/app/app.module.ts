import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgZorroAntdModule, NZ_I18N, en_US, NzIconModule } from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { PreviewComponent } from "./pages/preview/preview.component";
import { PopupComponent } from "./components/popup/popup.component";

import { NzListModule } from "ng-zorro-antd/list";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { UploadComponent } from "./components/upload/upload.component";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    PopupComponent,
    UploadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzListModule,
    NzGridModule,
    NzButtonModule,
    NzDropDownModule,
    NzPopoverModule,
    NzUploadModule,
    NzInputModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzModalModule,
    NzEmptyModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  entryComponents: [UploadComponent, PopupComponent],
})
export class AppModule {}
