import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomServicedetailComponent } from './roomServicedetail.component';

describe('RoomServicedetailComponent', () => {
  let component: RoomServicedetailComponent;
  let fixture: ComponentFixture<RoomServicedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomServicedetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomServicedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
