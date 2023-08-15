import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuitemComponent } from './sidemenuitem.component';

describe('SidemenuitemComponent', () => {
  let component: SidemenuitemComponent;
  let fixture: ComponentFixture<SidemenuitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidemenuitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidemenuitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
