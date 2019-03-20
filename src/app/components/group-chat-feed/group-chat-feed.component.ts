import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-group-chat-feed',
  templateUrl: './group-chat-feed.component.html',
  styleUrls: ['./group-chat-feed.component.css']
})
export class GroupChatFeedComponent implements OnInit {

  @ViewChild('scrollMe') private myScroller: ElementRef;

  constructor(private messagesService: MessagesService,
              private authService: AuthService,
              private dialogRef: MatDialog,
              private groupsService: GroupsService) { }

  showChat: boolean;
  messages = [];
  loadingSpinner = false;
  MyId;
  MyAvatar;
  currentChatUser;
  checkFirst = 1;

  // Infinite Scroll Helper
  count = 10;
  trackMsgCount;
  shouldLoad = true;
  allLoaded = false;

  // Picture message helpers
  isPicMsg = false;
  pictureMessage;

  ngOnInit() {
    this.groupsService.enteredGroup.subscribe((value: any) => {
      this.showChat = value;
      if (value) {
        this.getGroupMessages();
        this.currentChatUser = this.messagesService.currentChatUser;
      }
    });
    this.MyAvatar = this.authService.currentUserDetails().photoURL;
  }

  getGroupMessages() {
    this.loadingSpinner = true;
    this.messagesService.getGroupMessages(this.count).then((messageObs: any) => {
      messageObs.subscribe((messages) => {
      this.checkFirst = 1;
      if (messages === 'Nothing') {
        this.loadingSpinner = false;
        this.messages = [];
        this.count = 10;
        this.trackMsgCount = 0;
        this.shouldLoad = true;
        this.allLoaded = false;
        console.log('Nothing to Show');
      } else if (messages === 'firstmsg') {
        this.getGroupMessages();
      } else {
        this.loadingSpinner = false;
        this.trackMsgCount = 0;
        this.shouldLoad = true;
        this.allLoaded = false;
        const reversed = _.reverse(messages);
        this.messages = reversed;
        if (this.checkFirst === 1) {
          this.openDialog();
          this.checkFirst += 1;
        }
        this.scrollDown();
      }
      });
    });
  }

  // Loading overlay
  openDialog() {
    this.dialogRef.open(LoadingSpinnerComponent, {
      height: '150px',
      width: '150px'
    });
  }

  // Closing the loading overlay
  closeDialog() {
    this.dialogRef.closeAll();
  }

  // Infinite scrolling
  scrollHandler(e) {
    if (e === 'top') {
      if (this.shouldLoad) {
        this.count += 10;
        this.loadingSpinner = true;

        this.messagesService.getGroupMessages(this.count).then((gotMsgs: any) => {
          gotMsgs.subscribe((messages) => {
            this.messages = [];
            const reversed = _.reverse(messages);
            this.messages = reversed;
            this.loadingSpinner = false;
            if (this.messages.length === this.trackMsgCount) {
              this.shouldLoad = false;
            } else {
              this.trackMsgCount = this.messages.length;
            }
          });
        });
      } else {
        this.allLoaded = true;
      }
    }
  }

  // Scroll down
  scrollDown() {
    setTimeout(() => {
      this.myScroller.nativeElement.scrollTop = this.myScroller.nativeElement.scrollHeight;
      this.closeDialog();
    }, 1000);
  }

  // Choose bubble style
  chooseClass(msg) {
    this.MyId = this.authService.currentUserDetails().email;

    if (msg.sentby !== this.MyId && msg.message.includes('picMsg')) {
      this.isPicMsg = true;
      this.pictureMessage = msg.message.substring(6);
      return 'bubble client attachment';
    } else if (msg.sentby === this.MyId && msg.message.includes('picMsg')) {
      this.isPicMsg = true;
      this.pictureMessage = msg.message.substring(6);
      return 'bubble client attachment';
    } else if (msg.sentby !== this.MyId && !msg.message.includes('picMsg')) {
      this.isPicMsg = false;
      return 'bubble';
    } else if (msg.sentby === this.MyId && !msg.message.includes('picMsg')) {
      this.isPicMsg = false;
      return 'bubble client';
    }
  }

}
