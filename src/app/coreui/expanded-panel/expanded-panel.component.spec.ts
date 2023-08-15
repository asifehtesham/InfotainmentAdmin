import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedPanelComponent } from './expanded-panel.component';

describe('ExpandedPanelComponent', () => {
  let component: ExpandedPanelComponent;
  let fixture: ComponentFixture<ExpandedPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
