import { group } from '@angular/animations';
import { Component } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  checkPasswords() {
    let pass = this.registerForm.get('password')!.value;
    let confirmPass = this.registerForm.get('confirmPassword')!.value;

    return pass === confirmPass;
  }

  onSubmit() {
    if (this.checkPasswords()) {
      const user = this.registerForm.value;
      delete user['confirmPassword'];

      this.authService.registerUser(user)
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }
}
