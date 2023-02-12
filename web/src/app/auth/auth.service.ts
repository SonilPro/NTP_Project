import {Injectable} from '@angular/core';
import {User} from './user.model';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ApiProviderService} from '../api-provider.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private user: User | null = null;
  private users: User[] = [];
  private usersSubject: Subject<User[]> = new Subject<User[]>();
  errorEmitter: Subject<string> = new Subject<string>();
  authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private apiProvider: ApiProviderService) {
    apiProvider.getUsers().subscribe((res) => {
      this.users = res;
      this.usersSubject.next([...this.users]);
    });
  }

  registerUser(user: User) {
    this.apiProvider
      .addUser(user)
      .subscribe((res) => this.router.navigate(['/login']));
  }

  login(credentials: { username: string; password: string }) {
    this.apiProvider.login(credentials.username, credentials.password).subscribe((res: any) => {
      if (res.status === 'OK') {
        this.user = res.user;

        sessionStorage.setItem('x-access-token', res.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.authChange.next(true);

        this.apiProvider.getUsers().subscribe(res => {
          console.log(res);
          this.users = res;
        })

        this.router.navigate(['/']);
      } else {
        this.errorEmitter.next('Wrong credentials');
        this.authChange.next(false);
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
    return {...this.user} as User;
  }

  getUsers() {
    return this.usersSubject;
  }

  isAuthenticated() {
    let u = localStorage.getItem('user');
    if (!this.user && u) this.user = JSON.parse(u);
    return this.user != null;
  }

  getUserNameFromId(userId: number) {
    return (
      this.users.find((user) => user.id === userId)?.name ?? 'Unknown user'
    );
  }
}
