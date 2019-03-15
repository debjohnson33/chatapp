import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: any;

  constructor(private afauth: AngularFireAuth, private afs: AngularFirestore,
              private router: Router) {
              this.afauth.authState.subscribe((user) => {
                this.authState = user;
              });
  }

  // check Auth
  authUser(): boolean {
    return this.authState !== null && this.authState !== undefined ? true : false;
  }

  currentUserDetails(): firebase.User {
    return this.afauth.auth.currentUser;
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  signUp(usercreds) {
    return this.afauth.auth.createUserWithEmailAndPassword(usercreds.email,
      usercreds.password).then((user) => {
        this.authState = user;
        this.afauth.auth.currentUser.updateProfile({
          displayName: usercreds.displayName,
          photoURL: constants.PROFILE_PIC
        }).then(() => {
          this.setUserData(usercreds.email, usercreds.displayName, usercreds.photoURL);
        });
      });
  }


  setUserData(email: string, displayName: string, photoURL: string) {
    const path = `users/${this.currentUserId}`;
    const statuspath = `status/${this.currentUserId}`;
    const userdoc = this.afs.doc(path);
    const status = this.afs.doc(statuspath);
    userdoc.set({
      email,
      displayName,
      photoURL
    });
    status.set({
      status: 'online'
    });
    this.router.navigate(['dashboard']);
  }

  // Login Function
  login(usercreds) {
    return this.afauth.auth.signInWithEmailAndPassword(usercreds.email,
      usercreds.password).then((user) => {
        this.authState = user;
        const status = 'online';
        this.setUserStatus(status);
        this.router.navigate(['dashboard']);
      });
  }

  // Sets user status
  setUserStatus(status) {
    const statuscollection = this.afs.doc(`status/${this.currentUserId}`);
    const data = {
      status
    };
    statuscollection.update(data).catch((error) => {
      console.log(error);
    });
  }

  // Logout function
  logout() {
    this.afauth.auth.signOut().then(() => {
      this.setUserStatus('offline');
      this.router.navigate(['login']);
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
