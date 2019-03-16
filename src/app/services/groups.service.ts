import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs/';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  groupPicDefault: string;
  groupDocRef;

  constructor(private afauth: AngularFireAuth,
              private afs: AngularFirestore) { }

  // Creating a group
  createGroup(groupName) {
    return new Promise((resolve) => {
      this.afs.collection('groups').add({
        groupName,
        creator: this.afauth.auth.currentUser.email,
        conversationId: '',
        groupPic: this.groupPicDefault
      }).then((docRef) => {
        this.groupDocRef = docRef.id;
        docRef.collection('members').add({
          email: this.afauth.auth.currentUser.email,
          displayNAme: this.afauth.auth.currentUser.displayName,
          photoURL: this.afauth.auth.currentUser.photoURL
        }).then(() => {
          this.afs.collection('groupconvos').add({
            groupName,
            creator: this.afauth.auth.currentUser.email
          // tslint:disable-next-line:no-shadowed-variable
          }).then((docRef) => {
            this.afs.collection('groups').doc(this.groupDocRef).update({
              conversationId: docRef.id
            }).then(() => {
              resolve();
            });
          });
        });
      });
    });
  }
}
