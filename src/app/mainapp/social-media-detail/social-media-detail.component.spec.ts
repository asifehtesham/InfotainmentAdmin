import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaDetailComponent } from './social-media-detail.component';

describe('SocialMediaDetailComponent', () => {
  let component: SocialMediaDetailComponent;
  let fixture: ComponentFixture<SocialMediaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
