import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewversionComponent } from './form-newversion.component';

describe('FormNewversionComponent', () => {
  let component: FormNewversionComponent;
  let fixture: ComponentFixture<FormNewversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormNewversionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormNewversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
