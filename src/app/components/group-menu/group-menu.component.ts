import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.css']
})
export class GroupMenuComponent implements OnInit {

  currentGroup;
  isGroup = false;
  isOwner = false;

  constructor(private groupsService: GroupsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.groupsService.enteredGroup.subscribe((value) => {
      if (value) {
        this.currentGroup = this.groupsService.currentGroup;
        if (this.currentGroup.creator === this.authService.currentUserDetails().email) {
          this.isOwner = true;
          this.isGroup = true;
        }
      } else {
        this.isGroup = false;
      }
    });
  }

}
