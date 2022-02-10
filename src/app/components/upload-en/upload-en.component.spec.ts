import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEnComponent } from './upload-en.component';

describe('UploadEnComponent', () => {
  let component: UploadEnComponent;
  let fixture: ComponentFixture<UploadEnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
