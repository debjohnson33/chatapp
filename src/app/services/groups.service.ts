import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject, Subject } from 'rxjs/';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  // tslint:disable-next-line:max-line-length
  groupPicDefault = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/group-placeholder.jpg?alt=media&token=fd8915d0-9e49-44fa-bbfe-0efddd94a867';
  groupDocRef;
  enteredGroup = new Subject();
  currentGroup;

  constructor(private afauth: AngularFireAuth,
              private afs: AngularFirestore) { }

  // Entering a group
  enterGroup(group) {
    if (group !== 'closed') {
      this.currentGroup = group;
      this.enteredGroup.next('true');
    } else {
      this.currentGroup = '';
      this.enteredGroup.next('false');
    }
  }

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

  getGroups() {
    return this.afs.collection('groups', ref => ref.where('creator', '==', this.afauth.auth.currentUser.email)).valueChanges();
  }

}
