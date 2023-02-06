import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './posts/post.model';
import { User } from './auth/user.model';
import { environment } from '../environments/environment';

const BASE_URL = environment.api_base_url;

@Injectable({ providedIn: 'root' })
export class ApiProviderService {
  constructor(private httpClient: HttpClient) {}

  addUser(user: User) {
    return this.httpClient.post(BASE_URL + '/users', user);
  }

  getPosts() {
    console.log(BASE_URL);
    return this.httpClient.get(BASE_URL + '/posts').pipe(
      map((res: any) => {
        return res.posts;
      })
    );
  }

  addPost(post: Post) {
    return this.httpClient.post(BASE_URL + '/posts', post);
  }

  editPost(post: Post) {
    return this.httpClient.put(BASE_URL + '/posts', post);
  }

  deletePost(id: number) {
    return this.httpClient.delete(BASE_URL + '/posts/' + id);
  }

  getUsers() {
    return this.httpClient.get(BASE_URL + '/users').pipe(
      map((res: any) => {
        console.log(res);
        return res.users;
      })
    );
  }
}
