import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspaperDetailComponent } from './newspaper-detail.component';

describe('NewspaperDetailComponent', () => {
  let component: NewspaperDetailComponent;
  let fixture: ComponentFixture<NewspaperDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewspaperDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspaperDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
