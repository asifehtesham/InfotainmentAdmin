import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolldetailComponent } from './polldetail.component';

describe('PolldetailComponent', () => {
  let component: PolldetailComponent;
  let fixture: ComponentFixture<PolldetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolldetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
