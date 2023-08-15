import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesSelectionComponent } from './roles-selection.component';

describe('RolesSelectionComponent', () => {
  let component: RolesSelectionComponent;
  let fixture: ComponentFixture<RolesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
