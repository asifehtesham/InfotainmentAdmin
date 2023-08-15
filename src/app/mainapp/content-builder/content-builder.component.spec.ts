import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbuilderComponent } from './content-builder.component';

describe('ContentbuilderComponent', () => {
  let component: ContentbuilderComponent;
  let fixture: ComponentFixture<ContentbuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentbuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
