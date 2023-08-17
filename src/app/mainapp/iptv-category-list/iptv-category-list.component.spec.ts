import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptvCategoryListComponent } from './iptv-category-list.component';

describe('IptvCategoryListComponent', () => {
  let component: IptvCategoryListComponent;
  let fixture: ComponentFixture<IptvCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IptvCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IptvCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
