import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaTypeDetailComponent } from './social-media-type-detail.component';

describe('SocialMediaTypeDetailComponent', () => {
  let component: SocialMediaTypeDetailComponent;
  let fixture: ComponentFixture<SocialMediaTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaTypeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
