import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorDetailComponent } from './floor-detail.component';

describe('FloorDetailComponent', () => {
  let component: FloorDetailComponent;
  let fixture: ComponentFixture<FloorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
