import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeComponent } from './popup-de.component';

describe('PopupDeComponent', () => {
  let component: PopupDeComponent;
  let fixture: ComponentFixture<PopupDeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
