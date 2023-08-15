import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerydetailComponent } from './gallerydetail.component';

describe('GallerydetailComponent', () => {
  let component: GallerydetailComponent;
  let fixture: ComponentFixture<GallerydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerydetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
