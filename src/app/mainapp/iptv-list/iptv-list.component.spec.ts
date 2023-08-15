import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptvListComponent } from './iptv-list.component';

describe('IptvListComponent', () => {
  let component: IptvListComponent;
  let fixture: ComponentFixture<IptvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IptvListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IptvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
