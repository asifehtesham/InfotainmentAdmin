import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAnnouncementComponent } from './card-announcement.component';

describe('CardAnnouncementComponent', () => {
  let component: CardAnnouncementComponent;
  let fixture: ComponentFixture<CardAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAnnouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
