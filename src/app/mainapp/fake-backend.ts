import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../models/Users';
import { environment } from 'src/environments/environment';
import { PageData } from '../data/PageData';
import { ComponentsData } from '../data/ComponentsData';


import { BlogData } from '../data/BlogData';
import { NewsData } from '../data/NewsData';
import { RoomServicesData } from '../data/RoomServiceData';
import { PollData } from '../data/PollData';
import { GalleryData } from '../data/GalleryData';
import { BannerData } from '../data/BannerData';
import { UserData } from '../data/UserData';
import { CohortData } from '../data/CohortData';
import { RoleData } from '../data/RoleData';
import { SEOData } from '../data/SEOData';

import { NewspaperData } from '../data/NewspaperData';
import { CountryData } from '../data/CountryData';
import { FeedbackTypeData } from '../data/FeedbackTypeData';
import { GamesData } from '../data/GamesData';
import { IptvData } from '../data/IptvData';
import { RoomsData } from '../data/RoomsData';
import { MagazineData } from '../data/MagazineData';
import { SocialmediaData } from '../data/SocialmediaData';
import { SocialmediatypeData } from '../data/SocialmediatypeData';
import { BranchData } from '../data/BranchData';
import { FloorData } from '../data/FloorData';
import { ServicerequestData } from '../data/ServicerequestData';




import { IptvCategoryData } from '../data/IptvCategoryData';


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(mergeMap(() => {
            console.log('FakeBackendInterceptor called');


            if (request.url.startsWith(`${environment.apiUrl}seo`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok(SEOData);
            }
            else if (request.url.startsWith(`${environment.apiUrl}seo/`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok(SEOData[0]);
            }

            if (request.url.startsWith(`${environment.apiUrl}page/`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok(PageData[0]);
            }



            if (request.url.startsWith(`${environment.apiUrl}page_contents/get_by_page/1`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok({'success':true});
            }


            ///////////////// start infot
            
            // if (request.url.startsWith(`${environment.apiUrl}newsPaper?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:NewspaperData});
            // }


            // if (request.url.startsWith(`${environment.apiUrl}iptv?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:IptvData});
            // }
            if (request.url.startsWith(`${environment.apiUrl}rooms?index=1&limit=10`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok({data:RoomsData});
            }

            // if (request.url.startsWith(`${environment.apiUrl}magazine?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:MagazineData});
            // }

            // if (request.url.startsWith(`${environment.apiUrl}games?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:GamesData});
            // }

            if (request.url.startsWith(`${environment.apiUrl}feedbackType?index=1&limit=10`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok({data:FeedbackTypeData});
            }

            // if (request.url.startsWith(`${environment.apiUrl}country?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:CountryData});
            // }

            // if (request.url.startsWith(`${environment.apiUrl}socialMediaType?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:SocialmediatypeData});
            // }

            // if (request.url.startsWith(`${environment.apiUrl}socialMedia?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:SocialmediaData});
            // }

            
            // if (request.url.startsWith(`${environment.apiUrl}branch?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:BranchData});
            // }

            // if (request.url.startsWith(`${environment.apiUrl}floor?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:FloorData});
            // }


            // if (request.url.startsWith(`${environment.apiUrl}iptvCategory?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:IptvCategoryData});
            // }


            




            
            ///////////////// end infot

            // if (request.url.startsWith(`${environment.apiUrl}page`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok(PageData);

            // }


            // if (request.url.startsWith(`${environment.apiUrl}components`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok(ComponentsData);
            // }

            if (request.url.startsWith(`${environment.apiUrl}component/`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok(ComponentsData);
            }


            // if (request.url.startsWith(`${environment.apiUrl}service?index=1&limit=10`) && request.method === 'GET') {
            //     console.log("Fake interceptor page/");
            //     console.log(request.url);
            //     return ok({data:RoomServicesData});
            // }

            
            if (request.url.startsWith(`${environment.infotApiUrl}servicerequest?index=1&limit=10`) && request.method === 'GET') {
                console.log("Fake interceptor page/");
                console.log(request.url);
                return ok({data:ServicerequestData});
            }


            // if (request.url.startsWith(`${environment.apiUrl}blog/`) && request.method === 'GET') {
            //     console.log("Fake interceptor blog/");
            //     console.log(request.url);
            //     return ok(BlogData[0]);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}blog`) && request.method === 'GET') {
            //     console.log("Fake interceptor blog/");
            //     console.log(request.url);
            //     return ok(BlogData);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}news/`) && request.method === 'GET') {
            //     console.log("Fake interceptor news/");
            //     console.log(request.url);
            //     return ok(NewsData[0]);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}news`) && request.method === 'GET') {
            //     console.log("Fake interceptor news/");
            //     console.log(request.url);
            //     return ok(NewsData);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}services/`) && request.method === 'GET') {
            //     console.log("Fake interceptor services/");
            //     console.log(request.url);
            //     return ok(ServicesData[0]);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}services`) && request.method === 'GET') {
            //     console.log("Fake interceptor services/");
            //     console.log(request.url);
            //     return ok(ServicesData);
            // }


            // if (request.url.startsWith(`${environment.apiUrl}poll/`) && request.method === 'GET') {
            //     console.log("Fake interceptor poll/");
            //     console.log(request.url);
            //     return ok(PollData[0]);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}poll`) && request.method === 'GET') {
            //     console.log("Fake interceptor poll/");
            //     console.log(request.url);
            //     return ok(PollData);
            // }

            /*
            if (request.url.startsWith(`${environment.apiUrl}gallery/`) && request.method === 'GET') {
                console.log("Fake interceptor gallery/");
                console.log(request.url);
                return ok(GalleryData[0]);
            }

            if (request.url.startsWith(`${environment.apiUrl}gallery`) && request.method === 'GET') {
                console.log("Fake interceptor gallery/");
                console.log(request.url);
                return ok(GalleryData);
            }*/

            // if (request.url.startsWith(`${environment.apiUrl}banner/`) && request.method === 'GET') {
            //     console.log("Fake interceptor banner/");
            //     console.log(request.url);
            //     return ok(BannerData[0]);
            // }

            // if (request.url.startsWith(`${environment.apiUrl}banner`) && request.method === 'GET') {
            //     console.log("Fake interceptor banner/");
            //     console.log(request.url);
            //     return ok(BannerData);
            // }

            if (request.url.startsWith(`${environment.apiUrl}user/`) && request.method === 'GET') {
                console.log("Fake interceptor user/");
                console.log(request.url);
                return ok(UserData[0]);
            }
            if (request.url.startsWith(`${environment.apiUrl}cohort`) && request.method === 'GET') {
                console.log("Fake interceptor cohort/");
                console.log(request.url);
                return ok(CohortData);
            }
            
            if (request.url.startsWith(`${environment.apiUrl}user`) && request.method === 'GET') {
                console.log("Fake interceptor user/");
                console.log(request.url);
                return ok(UserData);
            }

            if (request.url.startsWith(`${environment.apiUrl}role/`) && request.method === 'GET') {
                console.log("Fake interceptor role/");
                console.log(request.url);
                return ok(RoleData[0]);
            }

            if (request.url.startsWith(`${environment.apiUrl}role`) && request.method === 'GET') {
                console.log("Fake interceptor role/");
                console.log(request.url);
                return ok(RoleData);
            }

            ///////////////////////////////////////

            if (request.url.startsWith(`${environment.apiUrl}role`) && request.method === 'GET') {
                console.log("Fake interceptor role/");
                console.log(request.url);
                return ok(RoleData);
            }






            ///////////////////////////////////////////

            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};