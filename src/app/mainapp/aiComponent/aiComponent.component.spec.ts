import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagebuilderComponent } from './aiComponent.component';

describe('PagebuilderComponent', () => {
  let component: PagebuilderComponent;
  let fixture: ComponentFixture<PagebuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagebuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagebuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
