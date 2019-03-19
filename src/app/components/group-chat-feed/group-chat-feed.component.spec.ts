import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatFeedComponent } from './group-chat-feed.component';

describe('GroupChatFeedComponent', () => {
  let component: GroupChatFeedComponent;
  let fixture: ComponentFixture<GroupChatFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
