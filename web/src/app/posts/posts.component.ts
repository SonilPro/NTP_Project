import {Component} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';
import {Post} from './post.model';
import {PostsService} from './posts.service';
import {Like} from "./like.model";

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

  authChangeSubscription: Subscription | null = null;

  newPost: Post = new Post();

  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  likes: Like[] = [];
  likesSubject: Subject<Like[]> = new Subject<Like[]>();

  loggedInUser: User = new User();

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.postsSubject = this.postsService.getPosts();
    this.postsSubject.subscribe((res) => {
      this.posts = res;
    });

    this.likesSubject = this.postsService.getLikes();
    this.likesSubject.subscribe(res => {
      this.likes = res;
    })

    this.loggedInUser = this.authService.getUser();

    this.authChangeSubscription = this.authService.authChange.subscribe(
      (res) => {
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
    let tmpPost: Post = {...this.posts[i]};
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

  like(postId: number) {
    if (this.isLiked(postId)) {
      this.postsService.deleteLike(this.likes.find(like => like.user_id === this.loggedInUser.id && like.post_id === postId)!);
    } else {
      const like: Like = {
        post_id: postId,
        user_id: this.loggedInUser.id
      }
      this.postsService.addLike(like);
    }
  }

  isLiked(postId: number) {
    return this.likes.filter(like => like.user_id === this.loggedInUser.id && like.post_id === postId).length > 0;
  }

  countLikes(postId: number) {
    return this.likes.filter(like => like.post_id === postId).length
  }
}
