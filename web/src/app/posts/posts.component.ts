import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent {
  title = 'novi-projekt';
  editNumber = -1;
  textAreaText = '';
  addPost = false;

  authenticated = false;
  authChangeSubscription: Subscription | null = null;

  newPost: Post = new Post();

  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  loggedInUser: User = new User();

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.postsSubject = this.postsService.getPosts();
    this.postsSubject.subscribe((res) => {
      this.posts = res;
    });

    this.authenticated = this.authService.isAuthenticated();
    this.loggedInUser = this.authService.getUser();

    this.authChangeSubscription = this.authService.authChange.subscribe(
      (res) => {
        this.authenticated = this.authService.isAuthenticated();
        this.loggedInUser = this.authService.getUser();
      }
    );
  }

  add() {
    if (this.loggedInUser.id !== undefined) {
      this.newPost.user_id = this.loggedInUser.id;
    }

    if (this.newPost.user_id !== undefined) {
      this.postsService.addPost(this.newPost);
      this.addPost = false;
    }
  }

  edit(i: number) {
    this.textAreaText = this.posts[i].content;
    this.editNumber = i;
  }

  saveEdit(i: number) {
    let tmpPost: Post = { ...this.posts[i] };
    tmpPost.content = this.textAreaText;
    this.postsService.editPost(tmpPost);
    this.editNumber = -1;
  }

  delete(i: number) {
    this.postsService.deletePost(this.posts[i].id);
    this.posts.splice(i, 1);
    this.editNumber = -1;
  }

  toggleNewPost() {
    this.addPost = !this.addPost;
  }

  getUser(userId: number) {
    return this.authService.getUserNameFromId(userId);
  }

  logout() {
    this.authService.logout();
  }
}
