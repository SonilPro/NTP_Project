import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Post} from './posts/post.model';
import {User} from './auth/user.model';
import {environment} from '../environments/environment';
import {Like} from "./posts/like.model";
import {Comment} from "./posts/comment.model";

const API_BASE_URL = environment.api_base_url;
const AUTH_BASE_URL = environment.auth_base_url;

@Injectable({providedIn: 'root'})
export class ApiProviderService {
  constructor(private httpClient: HttpClient) {
  }

  checkAuth() {
    return this.httpClient.get(API_BASE_URL);
  }

  addUser(user: User) {
    return this.httpClient.post(AUTH_BASE_URL + '/register', user);
  }

  login(username: string, password: string) {
    return this.httpClient.post(AUTH_BASE_URL + '/login', {username: username, password: password})
  }

  getPosts() {
    return this.httpClient.get(API_BASE_URL + '/posts').pipe(
      map((res: any) => {
        return res.posts;
      })
    );
  }

  addPost(post: Post) {
    return this.httpClient.post(API_BASE_URL + '/posts', post);
  }

  editPost(post: Post) {
    return this.httpClient.put(API_BASE_URL + '/posts', post);
  }

  deletePost(id: number) {
    return this.httpClient.delete(API_BASE_URL + '/posts/' + id);
  }

  getUsers() {
    return this.httpClient.get(API_BASE_URL + '/users').pipe(
      map((res: any) => {
        console.log(res);
        return res.users;
      })
    );
  }

  getLikes() {
    return this.httpClient.get(API_BASE_URL + '/likes').pipe(
      map((res: any) => {
        return res.likes;
      })
    );
  }

  addLike(like: Like) {
    return this.httpClient.post(API_BASE_URL + '/likes', like);
  }

  deleteLike(like: Like) {
    return this.httpClient.delete(API_BASE_URL + '/likes', {body: like});
  }

  getComments() {
    return this.httpClient.get(API_BASE_URL + '/comments').pipe(
      map((res: any) => {
        return res.likes;
      })
    );
  }

  addComment(comment: Comment) {
    return this.httpClient.post(API_BASE_URL + '/comments', comment);
  }

  deleteComment(commentId: number) {
    return this.httpClient.delete(API_BASE_URL + '/comments/' + commentId);
  }
}
