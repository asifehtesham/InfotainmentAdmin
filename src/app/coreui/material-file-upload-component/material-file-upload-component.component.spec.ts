import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFileUploadComponentComponent } from './material-file-upload-component.component';

describe('MaterialFileUploadComponentComponent', () => {
  let component: MaterialFileUploadComponentComponent;
  let fixture: ComponentFixture<MaterialFileUploadComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialFileUploadComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFileUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
