import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIconVerticalComponent } from './card-icon-vertical.component';

describe('CardIconVerticalComponent', () => {
  let component: CardIconVerticalComponent;
  let fixture: ComponentFixture<CardIconVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardIconVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardIconVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
