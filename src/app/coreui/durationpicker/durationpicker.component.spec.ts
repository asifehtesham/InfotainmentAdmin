import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationpickerComponent } from './durationpicker.component';

describe('DurationpickerComponent', () => {
  let component: DurationpickerComponent;
  let fixture: ComponentFixture<DurationpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationpickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
