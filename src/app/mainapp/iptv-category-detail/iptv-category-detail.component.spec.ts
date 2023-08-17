import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptvCategoryDetailComponent } from './iptv-category-detail.component';

describe('IptvCategoryDetailComponent', () => {
  let component: IptvCategoryDetailComponent;
  let fixture: ComponentFixture<IptvCategoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IptvCategoryDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IptvCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
