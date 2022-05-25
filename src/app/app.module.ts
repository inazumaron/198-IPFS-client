import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  NgZorroAntdModule,
  NZ_I18N,
  en_US,
  NzIconModule,
  NzResultModule,
  NzAlertModule,
} from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { PreviewComponent } from "./pages/preview/preview.component";
import { PopupComponent } from "./components/popup/popup.component";

import { NzTagModule } from "ng-zorro-antd/tag";
import { NzBadgeModule } from "ng-zorro-antd/badge";
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
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { UploadComponent } from "./components/upload/upload.component";
import { MainComponent } from "./pages/main/main.component";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { SendComponent } from "./pages/send/send.component";
import { ReceiveComponent } from "./pages/receive/receive.component";
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { PostSendComponent } from "./pages/post-send/post-send.component";
import { PostReceiveComponent } from "./pages/post-receive/post-receive.component";
import { NzCardModule } from "ng-zorro-antd/card";
import { UploadEnComponent } from "./components/upload-en/upload-en.component";
import { PopupDeComponent } from "./components/popup-de/popup-de.component";
import { KeysComponent } from "./components/keys/keys.component";
import { EnDownPopupComponent } from "./en-down-popup/en-down-popup.component";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    PopupComponent,
    UploadComponent,
    MainComponent,
    SendComponent,
    ReceiveComponent,
    ErrorPageComponent,
    PostSendComponent,
    PostReceiveComponent,
    UploadEnComponent,
    PopupDeComponent,
    KeysComponent,
    EnDownPopupComponent,
    PrettyBytesPipe,
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
    NzTypographyModule,
    NzCardModule,
    NzToolTipModule,
    NzResultModule,
    NzAlertModule,
    NzCheckboxModule,
    NzBadgeModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  entryComponents: [
    UploadComponent,
    PopupComponent,
    UploadEnComponent,
    PopupDeComponent,
    KeysComponent,
    EnDownPopupComponent,
  ],
})
export class AppModule {}
