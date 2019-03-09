import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  requests;

  constructor(private requestsService: RequestsService,
              private userService: UserService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.requestsService.getMyRequests().subscribe((requests) => {
      this.requests = this.userService.getUsers(requests);
    });
  }

  acceptRequest(request) {
    this.requestsService.acceptRequest(request).then(() => {
      this.snackBar.open('Friend Added', 'Okay', {duration: 3000});
    });
  }

  ignoreRequest(request) {
    this.requestsService.deleteRequest(request).then(() => {
      this.snackBar.open('Request Ignored', 'Okay', { duration: 3000 });
    });
  }

}
