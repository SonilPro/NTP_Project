import { EventEmitter, Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ApiProviderService } from '../api-provider.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: User | null = null;
  private users: User[] = [];
  errorEmitter: Subject<string> = new Subject<string>();
  authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private apiProvider: ApiProviderService) {
    apiProvider.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  registerUser(user: User) {
    this.apiProvider
      .addUser(user)
      .subscribe((res) => this.router.navigate(['/login']));
  }

  login(credentials: { username: string; password: string }) {
    this.apiProvider.getUsers().subscribe((res) => {
      this.users = res;
      let u = this.users.find(
        (u) =>
          u.username == credentials.username &&
          u.password == credentials.password
      );
      if (u) {
        this.user = u;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.authChange.next(true);
        this.router.navigate(['/']);
      } else {
        this.errorEmitter.next('Wrong credentials');
      }
    });
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    let u = localStorage.getItem('user');
    if (!this.user && u) this.user = JSON.parse(u);
    return { ...this.user } as User;
  }

  isAuthenticated() {
    let u = localStorage.getItem('user');
    if (!this.user && u) this.user = JSON.parse(u);
    return this.user != null;
  }

  getUserNameFromId(userId: number) {
    return (
      this.users.find((user) => user._id === userId)?.username ?? 'Unknown user'
    );
  }
}