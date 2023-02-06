import { Injectable } from '@angular/core';
import { ApiProviderService } from '../api-provider.service';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts: Post[] = [];
  postsSubject: Subject<Post[]> = new Subject<Post[]>();

  constructor(private apiProvider: ApiProviderService) {}

  public getPosts() {
    this.apiProvider.getPosts().subscribe((res) => {
      this.posts = res as Post[];
      this.postsSubject.next([...this.posts]);
    });
    return this.postsSubject;
  }

  public addPost(post: Post) {
    post.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.apiProvider.addPost(post).subscribe((res: any) => {
      this.posts.push({ ...post });
      this.postsSubject.next([...this.posts]);
    });
  }

  public editPost(post: Post) {
    this.apiProvider.editPost(post).subscribe((res: any) => {
      this.posts[this.posts.findIndex((p) => p._id == post._id)] = post;
      this.postsSubject.next([...this.posts]);
    });
  }

  public deletePost(id: number) {
    this.apiProvider.deletePost(id).subscribe((res) => {
      this.posts = this.posts.filter((post) => post._id != id);
      this.postsSubject.next([...this.posts]);
    });
  }
}
