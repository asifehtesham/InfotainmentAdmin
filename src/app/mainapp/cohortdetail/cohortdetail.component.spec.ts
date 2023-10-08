import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortdetailComponent } from './cohortdetail.component';

describe('CohortdetailComponent', () => {
  let component: CohortdetailComponent;
  let fixture: ComponentFixture<CohortdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CohortdetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohortdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
