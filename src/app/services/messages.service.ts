import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs/';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  enteredChat = new BehaviorSubject<boolean>(false);
  currentChatUser;

  constructor(private afs: AngularFirestore) { }

  enterChat(user) {
    this.currentChatUser = user;
    this.enteredChat.next(true);
  }
}
