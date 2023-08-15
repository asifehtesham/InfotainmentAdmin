import { Directive, ElementRef, NgZone, Optional } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Directionality } from '@angular/cdk/bidi';
import { merge, mergeMap, Observable } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Directive({
    selector: '[psScrollable]'
})
export class ScrollableDirective extends CdkScrollable {

    constructor(
        private scrollbar: PerfectScrollbarComponent,
        elementRef: ElementRef<HTMLElement>,
        scrollDispatcher: ScrollDispatcher,
        ngZone: NgZone,
        @Optional() dir?: Directionality,
    ) {
        super(elementRef, scrollDispatcher, ngZone, dir);
    }

    /** Returns observable that emits when a scroll event is fired on the host element. */
    elementScrolled(): Observable<Event> {
        return this.scrollbar.psScrollY;
        //return merge<CustomEvent>(this.scrollbar.psScrollY, this.scrollbar.psScrollX);
    }
}