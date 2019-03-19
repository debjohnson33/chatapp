import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFooterComponent } from './group-footer.component';

describe('GroupFooterComponent', () => {
  let component: GroupFooterComponent;
  let fixture: ComponentFixture<GroupFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
