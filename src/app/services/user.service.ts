import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);
  spinnersub = new BehaviorSubject<boolean>(false);

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
    this.spinnersub.next(true);
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
        }).then(() => {
          this.spinnersub.next(false);
          }).catch(() => {
            this.spinnersub.next(false);
        });
        }).catch(() => {
        this.spinnersub.next(false);
      });
    }).catch(() => {
      this.spinnersub.next(false);
    });
  }

  // Get all users
  getAllUsers() {
    return this.afs.collection('users').valueChanges().pipe(map((users) => {
      users.forEach((element: any, i) => {
        if (element.email === this.afauth.auth.currentUser.email) {
          users.splice(i, 1);
        }
      });
      return users;
    }));
  }

  // Get specific user profiles
  getUsers(emails) {
    const userProfiles = [];
    const collRef = this.afs.collection('users').ref;
    emails.forEach((element) => {
      const query = collRef.where('email', '==', element.sender);
      query.get().then((snapShot) => {
        if (!snapShot.empty) {
          userProfiles.push(snapShot.docs[0].data());
        }
      });
    });
    return userProfiles;
  }

  getUserDetails(users) {
    const userProfiles = [];
    const collRef = this.afs.collection('users').ref;
    users.forEach((element) => {
      const query = collRef.where('email', '==', element.email);
      query.get().then((snapShot) => {
        if (!snapShot.empty) {
          userProfiles.push(snapShot.docs[0].data());
        }
      });
    });
    return userProfiles;
  }


}
