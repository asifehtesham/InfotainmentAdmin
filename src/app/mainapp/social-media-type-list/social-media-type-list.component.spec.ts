import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaTypeListComponent } from './social-media-type-list.component';

describe('SocialMediaTypeListComponent', () => {
  let component: SocialMediaTypeListComponent;
  let fixture: ComponentFixture<SocialMediaTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
