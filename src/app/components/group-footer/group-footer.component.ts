import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-group-footer',
  templateUrl: './group-footer.component.html',
  styleUrls: ['./group-footer.component.css']
})
export class GroupFooterComponent implements OnInit {

  newMessage: string;
  picMessage: FileList;

  constructor(private msgService: MessagesService) { }

  ngOnInit() {
  }

  addMessage() {
    if (this.newMessage !== '') {
      this.msgService.addGroupMsg(this.newMessage);
      this.newMessage = '';
    }
  }

  sendImage(event) {
    this.picMessage = event.target.files;
    if (this.picMessage.item(0)) {
      this.msgService.addGroupPicMsg(this.picMessage.item(0));
    }
  }

}
