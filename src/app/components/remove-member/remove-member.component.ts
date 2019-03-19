import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';

// Snack bar
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {

  currentUser: string;
  members = [];
  loadingSpinner = false;

  constructor(private groupsService: GroupsService,
              private auth: AuthService,
              private snackbar: MatSnackBar) { }


  ngOnInit() {
      this.currentUser = this.auth.currentUserDetails().email;
      this.loadingSpinner = true;
      this.groupsService.getMembers().then((memberList: any) => {
        memberList.subscribe((members) => {
          this.members = members;
          this.loadingSpinner = false;
        });
      });
  }

  removeFriend(user) {
    this.groupsService.removeMember(user).then(() => {
      this.snackbar.open('Member removed', 'Okay', {
        duration: 3000
      });
    });
  }

}
