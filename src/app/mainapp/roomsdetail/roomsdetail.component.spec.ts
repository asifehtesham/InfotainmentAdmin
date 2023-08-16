import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsDetailComponent } from './roomsdetail.component';

describe('IptvDetailComponent', () => {
  let component: RoomsDetailComponent;
  let fixture: ComponentFixture<RoomsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
