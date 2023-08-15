import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTypeDetailComponent } from './feedback-type-detail.component';

describe('FeedbackTypeDetailComponent', () => {
  let component: FeedbackTypeDetailComponent;
  let fixture: ComponentFixture<FeedbackTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackTypeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
