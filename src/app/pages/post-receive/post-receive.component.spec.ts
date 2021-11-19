import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReceiveComponent } from './post-receive.component';

describe('PostReceiveComponent', () => {
  let component: PostReceiveComponent;
  let fixture: ComponentFixture<PostReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
