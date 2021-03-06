import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
import { FriendsService } from './friends.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private afs: AngularFirestore,
              private afauth: AngularFireAuth,
              private friendsService: FriendsService) { }

  requestRef = this.afs.collection('requests');
  friendsRef = this.afs.collection('friends');

  addRequest(newrequest) {
    return this.requestRef.add({
      sender: this.afauth.auth.currentUser.email,
      receiver: newrequest
    });
  }

  getMyRequests() {
    return this.afs.collection('requests', ref => ref.where('receiver', '==', this.afauth.auth.currentUser.email)).valueChanges();
  }

  // Accepting Requests
  acceptRequest(req) {
    return new Promise((resolve) => {
      const query = this.afs.collection('friends', ref => ref.where('email', '==', this.afauth.auth.currentUser.email)).ref;
      const query2 = this.afs.collection('friends', ref => ref.where('email', '==', req.email)).ref;
      query.get().then((snapShot) => {
        if (snapShot.empty) {
          this.friendsRef.add({
            email: this.afauth.auth.currentUser.email
          }).then((docRef) => {
            this.friendsRef.doc(docRef.id).collection('myfriends').add({
              email: req.email
            });
            }).then(() => {
              this.friendsService.getMyFriends();
            });
        } else {
          this.afs.doc('friends/' + snapShot.docs[0].id).collection('myfriends').add({
            email: req.email
          });
        }
      }).then(() => {
              query2.get().then((snapShot) => {
                if (snapShot.empty) {
                  this.friendsRef.add({
                    email: req.email
                  }).then((docRef) => {
                    this.friendsRef.doc(docRef.id).collection('myfriends').add({
                      email: this.afauth.auth.currentUser.email
                    });
                  }).then(() => {
                      this.friendsService.getMyFriends();
                    });
                } else {
                  this.afs.doc('friends/' + snapShot.docs[0].id).collection('myfriends').add({
                    email: this.afauth.auth.currentUser.email
                  });
                }
              });
        }).then(() => {
          this.deleteRequest(req).then(() => {
            resolve(true);
              });
            });
    });
  }

    // Deleting a request

    deleteRequest(req) {
      return new Promise((resolve) => {
        const requestColl = this.requestRef.ref;
        const query = requestColl.where('sender', '==', req.email);
        query.get().then((snapShot) => {
          snapShot.docs[0].ref.delete().then(() => {
            resolve(true);
          });
        });
      });
    }

    // Get the sent reuests to filter out user list
    getSentRequests() {
      return this.afs.collection('requests', ref => ref
      .where('sender', '==', this.afauth.auth.currentUser.email)).valueChanges();
    }

}
