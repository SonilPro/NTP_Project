import { Component } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  loggedInUser: User = new User();

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    this.postsSubject = this.postsService.getPosts();
    this.postsSubject.subscribe((res) => {
      this.posts = res;
      this.posts = this.posts.filter(
        (post) => post.userId === this.loggedInUser._id
      );
    });
  }

  getUser(userId: number) {
    return this.authService.getUserNameFromId(userId);
  }
}
