import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { MainappComponent } from "./mainapp.component";
import { AuthGuard } from "src/app/services/Authguard";
import { CoreuiModule } from "../coreui/coreui.module";
//import { MatCardModule, MatSidenavModule, MatListModule, MatGridListModule, MatCommonModule, MatSliderModule, MatToolbarModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatAutocomplete, MatAutocompleteModule, MatSelectionList, MatProgressBar, MatProgressBarModule, MatChipsModule, MatTreeModule, MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material";
import { MatSidenavModule } from "@angular/material/sidenav";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { fakeBackendProvider, FakeBackendInterceptor } from "./fake-backend";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventCalenderComponent } from "./event-calender/event-calender.component";
import { AdminModule } from "../admin/admin.module";
import { CalenderComponent } from "./calender/calender.component";
import {
  CalendarCommonModule,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
} from "angular-calendar";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FlatpickrModule } from "angularx-flatpickr";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MaterialModulesCommon } from "../material-module";
import { BarRatingModule } from "ngx-bar-rating";
import { PagebuilderComponent } from "./pagebuilder/pagebuilder.component";
import { PagesComponent } from "./pages/pages.component";
import { AdDirective } from "./content.directive";
import { PagelistComponent } from "./pagelist/pagelist.component";
import { PagedetailComponent } from "./pagedetail/pagedetail.component";
import { BloglistComponent } from "./bloglist/bloglist.component";
import { BlogdetailComponent } from "./blogdetail/blogdetail.component";
import { CategorydetailComponent } from "./categorydetail/categorydetail.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NewsdetailComponent } from "./newsdetail/newsdetail.component";
import { NewslistComponent } from "./newslist/newslist.component";
import { RoomServicedetailComponent } from "./roomServiceDetail/roomServicedetail.component";
import { RoomServicelistComponent } from "./roomServiceList/roomServicelist.component";
import { ServicelistComponent } from "./servicelist/servicelist.component";
import { ServicedetailComponent } from "./servicedetail/servicedetail.component";
import { PolllistComponent } from "./polllist/polllist.component";
import { PolldetailComponent } from "./polldetail/polldetail.component";
import { GallerydetailComponent } from "./gallerydetail/gallerydetail.component";
import { MenudetailComponent } from "./menudetail/menudetail.component";
import { GallerylistComponent } from "./gallerylist/gallerylist.component";
import { BannerlistComponent } from "./bannerlist/bannerlist.component";
import { BannerdetailComponent } from "./bannerdetail/bannerdetail.component";
import { UserdetailComponent } from "./userdetail/userdetail.component";
import { UserlistComponent } from "./userlist/userlist.component";
import { MenulistComponent } from "./menulist/menulist.component";
import { RolesSelectionComponent } from "./roles-selection/roles-selection.component";

import { Index as customComponentList } from "./custom-component/list/Index.component";
import { Index as customComponentBuilder } from "./custom-component/builder/Index.component";
import { CategorylistComponent } from "./categorylist/categorylist.component";
import { CalenderdetailComponent } from "./calenderdetail/calenderdetail.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { pageTemplatelist } from "./pageTemplatelist/pageTemplatelist.component";
import { TemplatedetailComponent } from "./templatedetail/templatedetail.component";
import { componentDetail } from "./componentdetail/componentdetail.component";
import { SlugTransformDirective } from "./slug-transform.directive";

import { FileExplorerComponent } from "./file-explorer/file-explorer.component";
import { FormDesignerComponent } from "./Forms/form-designer/form-designer.component";
import { FormlistComponent } from "./Forms/formlist/formlist.component";
import { FormViewerComponent } from "./Forms/form-viewer/form-viewer.component";
import { FormDetailComponent } from "./Forms/form-detail/form-detail.component";
import { FormNewversionComponent } from "./Forms/form-newversion/form-newversion.component";
import { PageNewversionComponent } from "./page-newversion/page-newversion.component";
import { codeEditor } from "./codeEditor/codeEditor.component";
import { GalleryMediaComponent } from './gallery-media/gallery-media.component';
import { CountrylistComponent } from './countrylist/countrylist.component';
import { CountrydetailComponent } from './countrydetail/countrydetail.component';
import { FeedbackTypeListComponent } from './feedback-type-list/feedback-type-list.component';
import { FeedbackTypeDetailComponent } from './feedback-type-detail/feedback-type-detail.component';
import { GamesDetailComponent } from './games-detail/games-detail.component';
import { GamesListComponent } from './games-list/games-list.component';
import { IPTVListComponent } from './iptv-list/iptv-list.component';
import { IPTVDetailComponent } from './iptv-detail/iptv-detail.component';
import { RoomsListComponent } from './roomslist/roomslist.component';
import { RoomsDetailComponent } from './roomsdetail/roomsdetail.component';
import { PatientRecordComponent } from './patientrecord/patientrecord.component';
import { MagazineDetailComponent } from './magazine-detail/magazine-detail.component';
import { MagazineListComponent } from './magazine-list/magazine-list.component';
import { NewspaperListComponent } from './newspaper-list/newspaper-list.component';
import { NewspaperDetailComponent } from './newspaper-detail/newspaper-detail.component';
import { SocialMediaDetailComponent } from './social-media-detail/social-media-detail.component';
import { SocialMediaListComponent } from './social-media-list/social-media-list.component';
import { SocialMediaTypeListComponent } from './social-media-type-list/social-media-type-list.component';
import { SocialMediaTypeDetailComponent } from './social-media-type-detail/social-media-type-detail.component';

import { BranchDetailComponent } from './branch-detail/branch-detail.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { AttendeesComponent } from "./attendees/attendees.component";
import { RoomDevicesComponent } from "./roomdevices/roomdevices.component";

import { FloorDetailComponent } from './floor-detail/floor-detail.component';
import { FloorListComponent } from './floor-list/floor-list.component';


import { ServicerequestDetailComponent } from './servicerequest-detail/servicerequest-detail.component';
import { ServicerequestListComponent } from './servicerequest-list/servicerequest-list.component';


import { IptvCategoryDetailComponent } from './iptv-category-detail/iptv-category-detail.component';
import { IptvCategoryListComponent } from './iptv-category-list/iptv-category-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceListComponent } from './device-list/device-list.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const routes: Routes = [
  {
    path: "",
    component: MainappComponent,
    children: [
      {
        path: "country",
        component: CountrylistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "feedbackType",
        component: FeedbackTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "games",
        component: GamesListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "iptv",
        component: IPTVListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "rooms",
        component: RoomsListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "magazine",
        component: MagazineListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "newspaper",
        component: NewspaperListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "socialmediatype",
        component: SocialMediaTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "socialmedia",
        component: SocialMediaListComponent,
        canActivate: [AuthGuard],
      },





      ////  end infot

      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "design/:type",
        component: PagebuilderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "design/:type",
        component: PagebuilderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "design/:type/:slug",
        component: PagebuilderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "design/:type/:slug",
        component: customComponentBuilder,
        canActivate: [AuthGuard],
      },
      {
        path: "pagelist",
        component: PagelistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "componentlist",
        component: customComponentList,
        canActivate: [AuthGuard],
      },
      {
        path: "templatelist",
        component: pageTemplatelist,
        canActivate: [AuthGuard],
      },
      {
        path: "pages",
        component: PagesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "menu",
        component: MenulistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "banners",
        component: BannerlistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "categories",
        component: CategorylistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "blogs",
        component: BloglistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "news",
        component: NewslistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "services",
        component: ServicelistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "polls",
        component: PolllistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "gallery",
        component: GallerylistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "gallery_media/:type",
        component: GalleryMediaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "users",
        component: UserlistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "events",
        component: CalenderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "files",
        component: FileExplorerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "forms",
        component: FormlistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "form_designer",
        component: FormDesignerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "country",
        component: CountrylistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "feedbackType",
        component: FeedbackTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "games",
        component: GamesListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "floor",
        component: FloorListComponent,
        canActivate: [AuthGuard],
      },
      
      {
        path: "service-request",
        component: ServicerequestListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "iptv-category",
        component: IptvCategoryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "branch",
        component: BranchListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "device",
        component: DeviceListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "iptv",
        component: IPTVListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "magazine",
        component: MagazineListComponent,
        canActivate: [AuthGuard],
      },


      {
        path: "room-service",
        component: RoomServicelistComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "newspaper",
        component: NewspaperListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "socialmediatype",
        component: SocialMediaTypeListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "socialmedia",
        component: SocialMediaListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "admin",
        loadChildren: () =>
          import("../admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    SlugTransformDirective,
    MainappComponent,
    EventCalenderComponent,
    CalenderComponent,
    PagebuilderComponent,
    PagesComponent,
    AttendeesComponent,
    RoomDevicesComponent,
    AdDirective,
    PagelistComponent,
    PagedetailComponent,
    TemplatedetailComponent,
    pageTemplatelist,
    BloglistComponent,
    BlogdetailComponent,
    CategorydetailComponent,
    NewsdetailComponent,
    NewslistComponent,
    RoomServicedetailComponent,
    RoomServicelistComponent,
    ServicelistComponent,
    ServicedetailComponent,
    PolllistComponent,
    PolldetailComponent,
    GallerydetailComponent,
    GallerylistComponent,
    BannerlistComponent,
    BannerdetailComponent,
    UserdetailComponent,
    UserlistComponent,
    RolesSelectionComponent,
    customComponentList,
    customComponentBuilder,
    CategorylistComponent,
    MenulistComponent,
    MenudetailComponent,
    componentDetail,
    CalenderdetailComponent,
    FileExplorerComponent,
    FormDesignerComponent,
    FormlistComponent,
    FormViewerComponent,
    FormDetailComponent,
    FormNewversionComponent,
    PageNewversionComponent,
    codeEditor,
    GalleryMediaComponent,
    CountrylistComponent,
    CountrydetailComponent,
    FeedbackTypeListComponent,
    FeedbackTypeDetailComponent,
    GamesDetailComponent,
    GamesListComponent,
    RoomsListComponent,
    RoomsDetailComponent,
    PatientRecordComponent,
    FloorDetailComponent,
    FloorListComponent,
    ServicerequestDetailComponent,
    ServicerequestListComponent,
    DeviceDetailComponent,
    DeviceListComponent,
    BranchDetailComponent,
    BranchListComponent,
    IptvCategoryDetailComponent,
    IptvCategoryListComponent,
    IPTVListComponent,
    IPTVDetailComponent,
    MagazineDetailComponent,
    MagazineListComponent,
    NewspaperListComponent,
    NewspaperDetailComponent,
    SocialMediaDetailComponent,
    SocialMediaListComponent,
    SocialMediaTypeListComponent,
    SocialMediaTypeDetailComponent,
    BranchDetailComponent,
    BranchListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatTooltipModule,
    CommonModule,
    BarRatingModule,
    RouterModule,
    CoreuiModule,
    AdminModule,
    PerfectScrollbarModule,
    MaterialModulesCommon,
    CdkTreeModule,
    FlexLayoutModule,
    FormsModule,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    CalendarCommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [RouterModule, PagesComponent, SlugTransformDirective],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA,
  //   NO_ERRORS_SCHEMA

  // ]
})
export class MainappModule { }
