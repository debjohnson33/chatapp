import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  styleUrls: ['./mygroups.component.css']
})
export class MygroupsComponent implements OnInit {

  groupName: string;
  showAdd = false;

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {

  }

  addGroup() {
    this.showAdd = this.showAdd;
  }

}
