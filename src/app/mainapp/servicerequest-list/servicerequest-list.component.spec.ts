import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicerequestListComponent } from './servicerequest-list.component';

describe('ServicerequestListComponent', () => {
  let component: ServicerequestListComponent;
  let fixture: ComponentFixture<ServicerequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicerequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicerequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
