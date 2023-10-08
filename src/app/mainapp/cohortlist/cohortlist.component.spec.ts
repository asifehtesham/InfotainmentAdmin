import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohortlistComponent } from './cohortlist.component';

describe('CohortlistComponent', () => {
  let component: CohortlistComponent;
  let fixture: ComponentFixture<CohortlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CohortlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
