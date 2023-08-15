import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewspaperListComponent } from './newspaper-list.component';

describe('NewspaperListComponent', () => {
  let component: NewspaperListComponent;
  let fixture: ComponentFixture<NewspaperListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewspaperListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewspaperListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
