import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImenuListComponent } from './imenu-list.component';

describe('ImenuListComponent', () => {
  let component: ImenuListComponent;
  let fixture: ComponentFixture<ImenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImenuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
