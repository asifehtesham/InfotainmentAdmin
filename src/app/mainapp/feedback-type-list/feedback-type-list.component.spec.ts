import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTypeListComponent } from './feedback-type-list.component';

describe('FeedbackTypeListComponent', () => {
  let component: FeedbackTypeListComponent;
  let fixture: ComponentFixture<FeedbackTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
