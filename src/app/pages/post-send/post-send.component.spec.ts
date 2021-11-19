import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSendComponent } from './post-send.component';

describe('PostSendComponent', () => {
  let component: PostSendComponent;
  let fixture: ComponentFixture<PostSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
