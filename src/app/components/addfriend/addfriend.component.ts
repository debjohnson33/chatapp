import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RequestsService } from '../../services/requests.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.css']
})
export class AddfriendComponent implements OnInit {

  users;

  constructor(private userService: UserService,
              private requestService: RequestsService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      console.log(users);
    });
  }

  addFriend(user) {
    this.requestService.addRequest(user.email).then(() => {
      this.snackBar.open('Request Sent', 'Okay', {duration: 3000});
    });
  }


}
