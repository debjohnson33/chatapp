import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  styleUrls: ['./mygroups.component.css']
})
export class MygroupsComponent implements OnInit {

  groupName: string;
  showAdd = false;
  myGroups = [];

  constructor(private groupsService: GroupsService,
              private toast: MatSnackBar) { }

  ngOnInit() {
    this.groupsService.getGroups().subscribe((allGroups) => {
      this.myGroups = allGroups;
    });
  }

  addGroup() {
    this.showAdd = this.showAdd;
  }

  createGroup() {
    this.groupsService.createGroup(this.groupName).then(() => {
      this.toast.open('Group Created', 'Dismiss', {
        duration: 3000
      });
      this.groupName = '';
    });
  }

}
