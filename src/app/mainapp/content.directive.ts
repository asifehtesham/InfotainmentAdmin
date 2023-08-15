import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[adHost]',
})
export class AdDirective {
    //@Input('content')
    //name: string;

    constructor(public viewContainerRef: ViewContainerRef) { }
    // constructor(public templateRef: TemplateRef<unknown>) { }
}
