import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedetailComponent } from './newversion.component';

describe('PagedetailComponent', () => {
  let component: PagedetailComponent;
  let fixture: ComponentFixture<PagedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagedetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
