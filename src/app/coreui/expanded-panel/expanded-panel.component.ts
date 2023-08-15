import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-expanded-panel',
  templateUrl: './expanded-panel.component.html',
  styleUrls: ['./expanded-panel.component.scss']
})
export class ExpandedPanelComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { }

  @Input() text: string;
  @Input() initHeight: number = 100;
  isExpanded: boolean = false;
  showOption: boolean = false;
  height: number = 100;


  @ViewChild('innerDiv') innerDiv: ElementRef;
  @ViewChild('outerDiv') outerDiv: ElementRef;

  ngOnInit(): void {

    this.height = this.initHeight;


  }

  public ngAfterViewChecked() {
    if (!this.showOption) {
      this.showOption = (this.innerDiv.nativeElement.offsetHeight > this.height);
      this.cdr.detectChanges();
    }
  }

  toggleHeight() {
    if (!this.isExpanded) {
      //this.outerDiv.nativeElement.offsetHeight = this.innerDiv.nativeElement.offsetHeight + 10;
      this.height = this.innerDiv.nativeElement.offsetHeight + 20;
    }
    else {
      //this.outerDiv.nativeElement.offsetHeight = this.height;
      this.height = this.initHeight;
    }

    this.isExpanded = !this.isExpanded;
  }

}
