import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreuiModule } from './coreui/coreui.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FakeBackendInterceptor } from './mainapp/fake-backend';
import { FormsModule } from "@angular/forms";
import { AdminModule } from './admin/admin.module';
import { PublicModule } from "./public/public.module";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BasicAuthInterceptor } from './services/BasicAuthInterceptor';
import { ErrorInterceptor } from './services/ErrorInterceptor';
import { GlobalInstances } from './GlobalInstances';
import { MaterialModulesCommon } from './material-module';
import * as jQuery from 'jquery';
import grapesjs from 'grapesjs';
import { ConfigProvider, DataService, NgeExplorerConfig, NgxExplorerModule } from 'ngx-explorer';
import { FileManagerService } from './services/filemanager.service';
// import { AdDirective } from './mainapp/content.directive';

export function initialiseGlobalDependencies(): () => Promise<any> {
  return () => Promise.resolve(true);
}

@NgModule({
  declarations: [
    AppComponent,
    // AdDirective
  ],
  imports: [
    BrowserModule,
    NgxExplorerModule,
    //FormioModule,
    AppRoutingModule,
    CoreuiModule,
    AdminModule,
    PublicModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModulesCommon,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: APP_INITIALIZER, useFactory: initialiseGlobalDependencies, multi: true, deps: [] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    },
    { provide: DataService, useClass: FileManagerService },
    {
      provide: ConfigProvider, useValue: new ConfigProvider({
        homeNodeName: 'Home'
      } as NgeExplorerConfig)
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
