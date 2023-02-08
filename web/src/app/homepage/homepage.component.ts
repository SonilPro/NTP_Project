import { Component } from '@angular/core';
import {PostsService} from "../posts/posts.service";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../auth/user.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  authenticated = false;
  authChangeSubscription: Subscription | null = null;

  loggedInUser: User = new User();

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}
  ngOnInit(){
    this.authenticated = this.authService.isAuthenticated();
    this.loggedInUser = this.authService.getUser();

    this.authChangeSubscription = this.authService.authChange.subscribe(
      (res) => {
        this.authenticated = this.authService.isAuthenticated();
        this.loggedInUser = this.authService.getUser();
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
