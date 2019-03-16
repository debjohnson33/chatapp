import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  styleUrls: ['./mygroups.component.css']
})
export class MygroupsComponent implements OnInit {

  groupName: string;
  showAdd = false;

  constructor() { }

  ngOnInit() {

  }

  addGroup() {
    this.showAdd = this.showAdd;
  }

}
