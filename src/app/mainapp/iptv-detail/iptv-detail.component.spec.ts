import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptvDetailComponent } from './iptv-detail.component';

describe('IptvDetailComponent', () => {
  let component: IptvDetailComponent;
  let fixture: ComponentFixture<IptvDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IptvDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IptvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
