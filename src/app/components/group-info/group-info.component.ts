import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  currentUser: string;
  currentGroup;
  members = [];
  loadingSpinner = false;

  constructor(private groupsService: GroupsService,
              private auth: AuthService) { }

  ngOnInit() {
    this.currentUser = this.auth.currentUserDetails().email;
    this.loadingSpinner = true;
    this.groupsService.getMembers().then((memberList: any) => {
      memberList.subscribe((members) => {
        this.members = members;
        this.loadingSpinner = false;
      })
    })
  }

}
