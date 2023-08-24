import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImenuDetailComponent } from './imenu-detail.component';

describe('ImenuDetailComponent', () => {
  let component: ImenuDetailComponent;
  let fixture: ComponentFixture<ImenuDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImenuDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImenuDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
