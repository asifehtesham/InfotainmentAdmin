import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerdetailComponent } from './bannerdetail.component';

describe('BannerdetailComponent', () => {
  let component: BannerdetailComponent;
  let fixture: ComponentFixture<BannerdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerdetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
