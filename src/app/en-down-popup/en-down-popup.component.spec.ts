import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnDownPopupComponent } from './en-down-popup.component';

describe('EnDownPopupComponent', () => {
  let component: EnDownPopupComponent;
  let fixture: ComponentFixture<EnDownPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnDownPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnDownPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
