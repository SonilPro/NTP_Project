import { Component } from '@angular/core';
import { filter, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import {ActivatedRoute} from "@angular/router";
import {Parser} from "@angular/compiler";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  user: User = new User();

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.postsSubject = this.postsService.getPosts();
    this.postsSubject.subscribe((res) => {
      this.user = this.authService.getUserById(parseInt(this.route.snapshot.paramMap.get('id')!)!)!;
      this.posts = res;
      this.posts = this.posts.filter(
        (post) => post.user_id === this.user.id
      );
    });
  }

  getUser(userId: number) {
    return this.authService.getUserNameFromId(userId);
  }
}
