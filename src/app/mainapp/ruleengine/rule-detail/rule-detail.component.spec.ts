import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDetailComponent } from './rule-detail.component';

describe('RuleDetailComponent', () => {
  let component: RuleDetailComponent;
  let fixture: ComponentFixture<RuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
