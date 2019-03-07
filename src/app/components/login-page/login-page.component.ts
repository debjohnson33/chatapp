import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  usercreds = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private auth: AuthService, private snackBar: MatSnackBar) { }

    emailFormControl: FormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX)
    ]);
    passwordFormControl: FormControl = new FormControl('', [
      Validators.required
    ]);
  ngOnInit() {
  }

  login() {
    let response = this.auth.login(this.usercreds);
    response.catch((err) => {
      if (err.code === 'auth/user-not-found') {
        this.snackBar.open('User not found', 'Close', { duration: 3000});
      }
      if (err.code === 'auth/wrong-password') {
        this.snackBar.open('Wrong Password', 'Close', { duration: 3000});
      }
    });
  }

  signup() {
    this.router.navigate(['signup']);
  }
}
