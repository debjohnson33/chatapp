import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  newMessage: string;
  picMessage: FileList;

  constructor(private msgService: MessagesService) { }

  ngOnInit() {
  }

  addMessage() {
    if (this.newMessage !== '') {
      this.msgService.addNewMsg(this.newMessage);
      this.newMessage = '';
    }
  }

  sendImage(event) {
    this.picMessage = event.target.files;
    if (this.picMessage.item(0)) {
      this.msgService.addPicMsg(this.picMessage.item(0));
    }
  }

  submit(e) {
    if (e.keyCode === 13) {
      this.addMessage();
    }
  }

}
