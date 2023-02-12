import {Component} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../auth/user.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: User[] = [];
  usersSubject: Subject<User[]> = new Subject<User[]>();

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.usersSubject = this.authService.getUsers();
    this.usersSubject.subscribe((res) => {
      this.users = res;
    });
  }
}
