import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomServicelistComponent } from './roomServicelist.component';

describe('RoomServicelistComponent', () => {
  let component: RoomServicelistComponent;
  let fixture: ComponentFixture<RoomServicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomServicelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomServicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
