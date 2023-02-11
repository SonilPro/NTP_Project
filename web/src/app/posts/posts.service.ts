import {Injectable} from '@angular/core';
import {ApiProviderService} from '../api-provider.service';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {Like} from "./like.model";
import {Comment} from "./comment.model";

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  likes: Like[] = [];
  likesSubject: Subject<Like[]> = new Subject<Like[]>();

  comments: Comment[] = [];
  commentsSubject: Subject<Comment[]> = new Subject<Comment[]>();

  constructor(private apiProvider: ApiProviderService) {
  }

  public getPosts() {
    this.apiProvider.getPosts().subscribe((res) => {
      this.posts = res as Post[];
      this.postsSubject.next([...this.posts]);
    });
    return this.postsSubject;
  }

  public addPost(post: Post) {
    post.datetime_published = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.apiProvider.addPost(post).subscribe((res: any) => {
      post.id = res.insertId;
      this.posts.push({...post});
      this.postsSubject.next([...this.posts]);
    });
  }

  public editPost(post: Post) {
    this.apiProvider.editPost(post).subscribe((res: any) => {
      this.posts[this.posts.findIndex((p) => p.id == post.id)] = post;
      this.postsSubject.next([...this.posts]);
    });
  }

  public deletePost(id: number) {
    this.apiProvider.deletePost(id).subscribe((res) => {
      this.posts = this.posts.filter((post) => post.id != id);
      this.postsSubject.next([...this.posts]);
    });
  }

  public getLikes() {
    this.apiProvider.getLikes().subscribe((res) => {
      this.likes = res as Like[];
      this.likesSubject.next([...this.likes]);
    });
    return this.likesSubject;
  }

  public addLike(like: Like) {
    this.apiProvider.addLike(like).subscribe((res: any) => {
      this.likes.push({...like});
      this.likesSubject.next([...this.likes]);
    });
  }

  public deleteLike(like: Like) {
    this.apiProvider.deleteLike(like).subscribe(res => {
      this.likes.splice(this.likes.indexOf(like), 1);
      this.likesSubject.next([...this.likes]);
    })
  }

  public getComments() {
    this.apiProvider.getComments().subscribe((res) => {
      this.comments = res as Comment[];
      this.commentsSubject.next([...this.comments]);
    });
    return this.commentsSubject;
  }

  public addComment(comment: Comment) {
    this.apiProvider.addComment(comment).subscribe((res: any) => {
      this.comments.push({...comment});
      this.commentsSubject.next([...this.comments]);
    });
  }
}
