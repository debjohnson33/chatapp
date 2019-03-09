import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs/';
import * as firebase from 'firebase';

@Injectable()
export class FriendsService {

  friendsCollection: firebase.firestore.CollectionReference = this.afs.collection('friends').ref;
  friendsCollTrigger = new BehaviorSubject<string>('Exists');
  docId: string;

  constructor(private afauth: AngularFireAuth, private afs: AngularFirestore) { }

  getMyFriends() {
    return new Promise((resolve) => {
      const query = this.friendsCollection.where('email', '==', this.afauth.auth.currentUser.email);
      query.get().then((snapShot) => {
        if (!snapShot.empty) {
          this.docId = snapShot.docs[0].id;
          this.friendsCollTrigger.next('Exists');
          resolve(this.friendsCollTrigger);
        } else {
          this.friendsCollTrigger.next('Nothing');
          resolve(this.friendsCollTrigger);
        }
      });
    });
  }

  getFriendList() {
    return this.afs.doc('friends/' + this.docId).collection('myfriends').valueChanges();
  }
}
