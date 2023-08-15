import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryMediaComponent } from './gallery-media.component';

describe('GalleryMediaComponent', () => {
  let component: GalleryMediaComponent;
  let fixture: ComponentFixture<GalleryMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
