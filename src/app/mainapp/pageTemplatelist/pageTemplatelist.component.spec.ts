import { ComponentFixture, TestBed } from '@angular/core/testing';

import { pageTemplatelist } from './pageTemplatelist.component';

describe('PagelistComponent', () => {
  let component: pageTemplatelist;
  let fixture: ComponentFixture<pageTemplatelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ pageTemplatelist ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(pageTemplatelist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
