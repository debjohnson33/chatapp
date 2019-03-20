import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chatFeed = false;
  groupChatFeed = false;

  constructor(private msgService: MessagesService,
              private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsService.enteredGroup.subscribe((value) => {
      if (value) {
        this.groupChatFeed = true;
        this.chatFeed = false;
      }
    });
    this.msgService.enteredChat.subscribe((value) => {
      if (value) {
        this.chatFeed = true;
        this.groupChatFeed = false;
      }
    });
  }

}
