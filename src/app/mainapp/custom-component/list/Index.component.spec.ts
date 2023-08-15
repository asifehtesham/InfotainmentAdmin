import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagelistComponent } from './Index.component';

describe('PagelistComponent', () => {
  let component: PagelistComponent;
  let fixture: ComponentFixture<PagelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
