import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  // tslint:disable-next-line:max-line-length
  groupPicDefault = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/group-placeholder.jpg?alt=media&token=fd8915d0-9e49-44fa-bbfe-0efddd94a867';
  groupDocRef;
  enteredGroup = new BehaviorSubject<boolean>(false);
  currentGroup;

  constructor(private afauth: AngularFireAuth,
              private afs: AngularFirestore,
              private storage: AngularFireStorage) { }

  // Entering a group
  enterGroup(group) {
    if (group !== 'closed') {
      this.currentGroup = group;
      this.enteredGroup.next(true);
    } else {
      this.currentGroup = '';
      this.enteredGroup.next(false);
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
    return new Promise((resolve) => {
      const createdGroupObs = this.afs.collection('groups', ref => ref
        .where('creator', '==', this.afauth.auth.currentUser.email)).valueChanges();
      const memberofCollRef = this.afs.collection('memberof').ref;
      const queryRef = memberofCollRef.where('email', '==', this.afauth.auth.currentUser.email);
      queryRef.get().then((snapShot) => {
        if (!snapShot.empty) {
          const memberofObs = this.afs.doc('memberof/' + snapShot.docs[0].id).collection('members').valueChanges();
          const combinedObs = combineLatest(createdGroupObs, memberofObs);
          resolve(combinedObs);
        } else {
          resolve(createdGroupObs);
        }
      });
    });
  }

  // Add members to group
  addMember(user) {
    return new Promise((resolve) => {
      const groupCollRef = this.afs.collection('groups').ref;
      const firstlevelquery = groupCollRef.where('groupName', '==', this.currentGroup.groupName);
      const secondquery = firstlevelquery.where('creator', '==', this.afauth.auth.currentUser.email);
      secondquery.get().then((snapShot) => {
        if (!snapShot.empty) {
          this.afs.doc('groups/' + snapShot.docs[0].id).collection('members').add(user).then(() => {
            const memberOfCollRef = this.afs.collection('memberof').ref;
            const queryRef = memberOfCollRef.where('email', '==', user.email);
            // tslint:disable-next-line:no-shadowed-variable
            queryRef.get().then((snapShot) => {
              if (snapShot.empty) {
                this.afs.collection('memberof').add({
                  email: user.email
                }).then((docRef) => {
                  this.afs.doc('memberof/' + docRef.id).collection('groups').add(this.currentGroup).then(() => {
                    resolve();
                  });
                });
              } else {
                this.afs.doc('memberof/' + snapShot.docs[0].id).collection('groups').add(this.currentGroup).then(() => {
                  resolve();
                });
              }
            });
          });
        }
      });
    });
  }

  // Get members from a group
  getMembers() {
    return new Promise((resolve) => {
      const groupCollRef = this.afs.collection('groups').ref;
      const queryRef = groupCollRef.where('groupName', '==', this.currentGroup.groupName).where('creator', '==', this.currentGroup.creator);
      queryRef.get().then((snapShot) => {
        resolve(this.afs.doc('groups/' + snapShot.docs[0].id).collection('members').valueChanges());
      });
    });
  }

  // Remove a member
  removeMember(user) {
    return new Promise((resolve) => {
      const groupCollRef = this.afs.collection('groups').ref;
      const queryRef = groupCollRef.where('groupName', '==', this.currentGroup.groupName).where('creator', '==', this.currentGroup.creator);
      queryRef.get().then((snapShot) => {
        const memberCollref = this.afs.doc('groups/' + snapShot.docs[0].id).collection('members').ref;
        const query = memberCollref.where('email', '==', user.email);
        query.get().then((snap) => {
          snap.docs[0].ref.delete().then(() => {
            const memberofCollRef = this.afs.collection('memberof').ref;
            const mbrquery = memberofCollRef.where('email', '==', user.email);
            mbrquery.get().then((snapShot1) => {
              const groubsubCollRef = this.afs.doc('memberof/' + snapShot1.docs[0].id).collection('groups').ref;
              const grpquery = groubsubCollRef.where('groupName', '==', this.currentGroup.groupName)
                .where('creator', '==', this.currentGroup.creator);
              grpquery.get().then((snapShot2) => {
                snapShot2.docs[0].ref.delete().then(() => {
                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }

  changeGroupPic(pic) {
    let downloadURL;
    const uploadTask = this.storage.upload('/groupPics/' + this.currentGroup.groupName, pic);
    uploadTask.then((data) => {
      downloadURL = data.downloadURL;
      if (data.metadata.contentType.match('image/.*')) {
        const groupCollRef = this.afs.collection('groups').ref;
        const queryRef = groupCollRef.where('groupName', '==', this.currentGroup.groupName)
          .where('creator', '==', this.currentGroup.creator);
        queryRef.get().then((snapShot) => {
          snapShot.docs[0].ref.update({
            groupPic: downloadURL
          });
        });
      } else {
        data.ref.delete().then(() => {
          console.log('Not an image');
        });
      }
      }).catch((err) => {
        console.log('Upload failed');
        console.log(err);
      });
  }


}
