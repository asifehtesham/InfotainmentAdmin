import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderdetailComponent } from './calenderdetail.component';

describe('CalenderdetailComponent', () => {
  let component: CalenderdetailComponent;
  let fixture: ComponentFixture<CalenderdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderdetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
