import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);

  constructor(private afauth: AngularFireAuth, private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.afauth.authState.subscribe((user) => {
      this.currentUser.next(user);
    });
   }

  updateName(newname) {
    return this.afs.doc('users/' + this.afauth.auth.currentUser.uid).update({
      displayName: newname
    }).then(() => {
      this.afauth.auth.currentUser.updateProfile({
        displayName: newname,
        photoURL: this.afauth.auth.currentUser.photoURL
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  updateProfilePic(file) {
    let downloadURL;
    const uploadTask = this.storage.upload('profilepics/' + this.afauth.auth.currentUser.uid, file);
    uploadTask.then((data) => {
      downloadURL = data.downloadURL;
      this.afs.doc('users/' + this.afauth.auth.currentUser.uid).update({
        photoURL: downloadURL
      }).then(() => {
        this.afauth.auth.currentUser.updateProfile({
          displayName: this.afauth.auth.currentUser.displayName,
          photoURL: downloadURL
        });
      });
    });
  }
}
