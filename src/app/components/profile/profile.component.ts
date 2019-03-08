import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user;
  nickNameedit = false;
  newNickname: string;
  selectedFiles: FileList;
  spinnerToggle = false;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe((user) => {
      this.user = user;
    });
    this.userService.spinnersub.subscribe((value) => {
      this.spinnerToggle = value;
    });
   }

  ngOnInit() {
  }

  editName() {
    this.nickNameedit = !this.nickNameedit;
  }

  updateName() {
    this.userService.updateName(this.newNickname).then(() => {
      this.newNickname = '';
      this.editName();
    });
  }

  chooseImage(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)) {
      this.userService.updateProfilePic(this.selectedFiles.item(0));
    }
  }
}
