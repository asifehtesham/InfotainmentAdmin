import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerequestDetailComponent } from './servicerequest-detail.component';

describe('ServicerequestDetailComponent', () => {
  let component: ServicerequestDetailComponent;
  let fixture: ComponentFixture<ServicerequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicerequestDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicerequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
