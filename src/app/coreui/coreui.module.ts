import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
//import { MatDrawerContent, MatDrawer, MatLabel, MatCommonModule, MatSidenavModule, MatIconModule, MatChipsModule, MatListModule, MatMenuModule, MatToolbarModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatCardModule, MatGridListModule } from "@angular/material";
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidemenuitemComponent } from './sidemenuitem/sidemenuitem.component';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CardComponent } from './card/card.component';
import { AreaComponent } from './area/area.component';
import { PieComponent } from './pie/pie.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MaterialFileUploadComponentComponent } from './material-file-upload-component/material-file-upload-component.component';
import { SingleFileUploadComponent } from './single-file-upload/single-file-upload.component';
import { DragDropDirective } from "./DragDropDirective";
import { MaterialElevationDirective } from "./material-elevation.directive";
import { EnumtostringPipe } from '../pipes/enumtostring';
import { MinuteOrHourPipe } from '../pipes/minuteorhourpipe';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModulesCommon } from '../material-module';
import { BarRatingModule } from 'ngx-bar-rating';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { ExpandedPanelComponent } from './expanded-panel/expanded-panel.component';
import { InitialsPipe } from '../pipes/initials-pipe';
import { TimeDurationPipe } from '../pipes/time-duration-pipe';
import { CardIconComponent } from './card-icon/card-icon.component';
import { CardIconVerticalComponent } from './card-icon-vertical/card-icon-vertical.component';
import { CardAnnouncementComponent } from './card-announcement/card-announcement.component';
import { TimePipe } from '../pipes/timepipe';
import { ScrollableDirective } from './ScrollableDirective';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChartComponent } from './chart/chart.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LoadingComponent } from './loading/loading.component';
import { DatetimepickerComponent } from './datetimepicker/datetimepicker.component';
import { DurationpickerComponent } from './durationpicker/durationpicker.component';
import { SeoformComponent } from './seoform/seoform.component';
import { FileManagerComponent } from './filemanager/filemanager.component';
import { NgxExplorerModule, DataService } from 'ngx-explorer';
import { FormBuilder } from 'formiojs';
import { FormioComponent } from './formio/components/formio/formio.component';
import { FormioLoaderComponent } from './formio/components/loader/formio.loader.component';
import { FormioBaseComponent } from './formio/FormioBaseComponent';
import { FormBuilderComponent } from './formio/components/formbuilder/formbuilder.component';
import { FormioAlertsComponent } from './formio/components/alerts/formio.alerts.component';
import { ParseHtmlContentPipe } from './formio/components/alerts/parse-html-content.pipe';
import { FormioAlerts } from './formio/components/alerts/formio.alerts';
import { CustomTagsService } from './formio/custom-component/custom-tags.service';
import { ContentbuilderComponent } from "../mainapp/content-builder/content-builder.component";
import { TextComponent } from "../mainapp/text-component/text-component.component";
import { AngularEditorModule } from "@kolkov/angular-editor";


@NgModule({
  declarations: [SidenavComponent,
    SidebarComponent,
    SidemenuitemComponent,
    HeaderComponent,
    CardComponent,
    AreaComponent,
    PieComponent,
    ChartComponent,
    MaterialFileUploadComponentComponent,
    SingleFileUploadComponent,
    DragDropDirective,
    MaterialElevationDirective,
    EnumtostringPipe,
    InitialsPipe,
    MinuteOrHourPipe,
    TimeDurationPipe,
    TimePipe,
    SearchPanelComponent,
    FilterPanelComponent,
    ExpandedPanelComponent,
    CardIconComponent,
    CardIconVerticalComponent,
    CardAnnouncementComponent,
    ScrollableDirective,
    TimepickerComponent,
    LoadingComponent,
    DatetimepickerComponent,
    DurationpickerComponent,
    SeoformComponent,
    FileManagerComponent,
    FormioComponent,
    FormioBaseComponent,
    FormBuilderComponent,
    FormioLoaderComponent,
    FormioAlertsComponent,
    ParseHtmlContentPipe,
    ContentbuilderComponent,
    TextComponent
  ],
  exports: [
    ContentbuilderComponent,
    TextComponent,
    FilterPanelComponent,
    ExpandedPanelComponent,
    SearchPanelComponent,
    SidenavComponent,
    SidebarComponent,
    HeaderComponent,
    CardComponent,
    CardIconVerticalComponent,
    CardIconComponent,
    CardAnnouncementComponent,
    AreaComponent,
    PieComponent,
    ChartComponent,
    MaterialFileUploadComponentComponent,
    SingleFileUploadComponent,
    MaterialElevationDirective,
    ScrollableDirective,
    EnumtostringPipe, MinuteOrHourPipe, TimeDurationPipe, InitialsPipe,
    ColorPickerModule,
    TimepickerComponent,
    NgxMaterialTimepickerModule,
    LoadingComponent,
    DatetimepickerComponent,
    DurationpickerComponent,
    FileManagerComponent,
    FormioComponent,
    FormBuilderComponent,
    FormioLoaderComponent,
    FormioAlertsComponent,
    SeoformComponent
  ],
  imports: [
    NgxExplorerModule,
    CommonModule,
    MaterialModulesCommon,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    HighchartsChartModule,
    BarRatingModule,
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    AngularEditorModule,
  ],
  providers: [
    FormioAlerts,
    CustomTagsService
  ]
})
export class CoreuiModule { }
