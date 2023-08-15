import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../services/Authguard';
import { RouterModule, Routes } from '@angular/router';

import { CoreuiModule } from '../coreui/coreui.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EnumtoArrayPipe } from '../pipes/enumtoArray';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MaterialModulesCommon } from '../material-module';
import * as jQuery from 'jquery';
import grapesjs from 'grapesjs';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const routes: Routes = [
]


@NgModule({
  declarations: [EnumtoArrayPipe],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    DragDropModule,
    RouterModule,
    CoreuiModule,
    PerfectScrollbarModule,
    MaterialModulesCommon,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: []

})
export class AdminModule { }
