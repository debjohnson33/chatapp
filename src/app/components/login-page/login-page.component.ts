import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  usercreds = {
    email: '',
    password: ''
  }

  constructor(private router: Router, private auth: AuthService) { }

    emailFormControl: FormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX)
    ]);
    passwordFormControl: FormControl = new FormControl('', [
      Validators.required
    ]);
  ngOnInit() {
  }

  signup() {
    this.router.navigate(['signup']);
  }
}
