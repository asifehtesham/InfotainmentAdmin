import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagazineListComponent } from './magazine-list.component';

describe('MagazineListComponent', () => {
  let component: MagazineListComponent;
  let fixture: ComponentFixture<MagazineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagazineListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagazineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
