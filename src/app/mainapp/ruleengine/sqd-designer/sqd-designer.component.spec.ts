import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqdDesignerComponent } from './sqd-designer.component';

describe('SqdDesignerComponent', () => {
  let component: SqdDesignerComponent;
  let fixture: ComponentFixture<SqdDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqdDesignerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqdDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
